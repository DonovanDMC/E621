/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type FormHelper from "./FormHelper";
import MultipartData from "./MultipartData";
import type E621 from "..";
import * as http from "http";
import * as https from "https";
export class APIError extends Error {
	name = "APIError";
	type: "UNEXPECTED" | "PARSE" | "UNKNOWN";
	statusCode: number;
	statusMessage: string;
	method: string;
	path: string;
	reqBody: unknown | null;
	resBody: unknown | null;
	constructor(type: APIError["type"], statusCode: number, statusMessage: string, method: string, path: string, reqBody: unknown | null, resBody: unknown | null) {
		if (type === "UNEXPECTED") super(`Unexpected ${statusCode} ${statusMessage} on "${method.toUpperCase()} ${path}"`);
		else if (type === "PARSE") super(`Parse Error on "${method.toUpperCase()} ${path}"`);
		else super(`Unknown Error on "${method.toUpperCase()} ${path}" (${statusCode} ${statusMessage})`);

		this.name = `APIError[${type || "UNKNOWN"}]`;
		this.type = type;
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.method = method;
		this.path = path;
		this.reqBody = reqBody;
		this.resBody = resBody;
	}
}

export default class RequestHandler {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: RequestHandler) {
					return !this.main.options.authUser || !this.main.options.authKey ? null : `Basic ${Buffer.from(`${this.main.options.authUser}:${this.main.options.authKey}`).toString("base64")}`;
				},
				configurable: false,
				enumerable: false
			},
			main: {
				value: main,
				configurable: false,
				enumerable: false,
				writable: false
			}
		});
	}

	authCheck(func: string, error = true) {
		if (this.auth === null) {
			if (error) throw new Error(`Authentication is required to use ${func}`);
			else return false;
		} else return true;
	}

	// null = 204 No Content
	async get<T = unknown>(path: string) {
		return new Promise<T | null>((resolve, reject) => {
			(this.main.options.instanceSSL ? https : http)
				.request({
					method: "GET",
					hostname: this.main.options.instanceHost,
					port: this.main.options.instancePort,
					path,
					headers: {
						"User-Agent": this.main.options.userAgent,
						"Host": this.main.options.instanceHost,
						...(this.auth === null ? {} : {
							Authorization: this.auth
						})
					}
				}, (req) => {
					const data: Array<Buffer> = [];
					req
						.on("error", (err) => reject(err))
						.on("data", (d) => data.push(d))
						.on("end", () => {
							if (!req.statusCode || !req.statusMessage) reject(new Error("No Status Information"));
							if (req.statusCode === 204) return resolve(null);
							else if (req.statusCode === 200 || req.statusCode === 201) {
								try {
									resolve(JSON.parse(Buffer.concat(data).toString()));
								} catch {
									reject(new APIError("PARSE", req.statusCode, req.statusMessage!, "GET", path, null, Buffer.concat(data).toString()));
								}
							} else {
								let d: unknown | string;
								try {
									d = Buffer.concat(data).toString();
									d = JSON.parse(String(d));
								} catch {
									// ignore
								}

								reject(new APIError("UNEXPECTED", req.statusCode!, req.statusMessage!, "GET", path, null, d));
							}
						});
				})
				.end();
		});
	}

	async post<T = unknown>(path: string, body?: string) { return this.other<T>("POST", path, body); }
	async postWithFile<T = unknown>(path: string, body: FormHelper, files: Array<{ content: Buffer; name: string; }>) { return this.otherWithFile<T>("POST", path, body, files); }
	async patch<T = unknown>(path: string, body?: string) { return this.other<T>("PATCH", path, body); }
	async put<T = unknown>(path: string, body?: string) { return this.other<T>("PUT", path, body); }
	async delete<T = unknown>(path: string, body?: string) { return this.other<T>("DELETE", path, body); }

	async other<T = unknown>(method: string, path: string, body?: string) {
		return new Promise<T | null>((resolve, reject) => {
			const r = (this.main.options.instanceSSL ? https : http)
				.request({
					method,
					hostname: this.main.options.instanceHost,
					port: this.main.options.instancePort,
					path,
					headers: {
						"User-Agent": this.main.options.userAgent,
						"Content-Type": "application/x-www-form-urlencoded",
						"Host": this.main.options.instanceHost,
						...(this.auth === null ? {} : {
							Authorization: this.auth
						})
					}
				}, (req) => {
					const data: Array<Buffer> = [];
					req
						.on("error", (err) => reject(err))
						.on("data", (d) => data.push(d))
						.on("end", () => {
							if (!req.statusCode || !req.statusMessage) reject(new Error("No Status Information"));
							if (req.statusCode === 204) return resolve(null);
							else if (req.statusCode === 200 || req.statusCode === 201) {
								try {
									resolve(JSON.parse(Buffer.concat(data).toString()));
								} catch {
									reject(new APIError("PARSE", req.statusCode, req.statusMessage!, method, path, body ?? null, Buffer.concat(data).toString()));
								}
							} else {
								let d: unknown | string;
								try {
									d = Buffer.concat(data).toString();
									d = JSON.parse(String(d));
								} catch {
									// ignore
								}

								reject(new APIError("UNEXPECTED", req.statusCode!, req.statusMessage!, method, path, body ?? null, d));
							}
						});
				});
			if (body) r.write(body);
			r.end();
		});
	}

	// the things I do for zero dependencies
	// not well tested at all
	async otherWithFile<T = unknown>(method: string, path: string, body: FormHelper, files: Array<{ content: Buffer; name: string; }>) {
		return new Promise<T | null>((resolve, reject) => {
			const multi = new MultipartData();
			files.forEach(({ content, name }, i) => {
				const magic = [...(new Uint8Array(content.slice(0,4)))].map(v => v.toString(16).toUpperCase()).join("");
				let filename;
				switch (magic){
					case "47494638": filename = `upload${i}.gif`; break;
					case "89504E47": filename = `upload${i}.png`; break;
					case "FFD8FFDB": case "FFD8FFE0": case "49460001": case "FFD8FFEE": case "69660000": filename = `upload${i}.jpeg`; break;
					case "1A45DFA3": filename = `upload${i}.webm`; break;
					case "52494646": filename = `upload${i}.webp`; break;
					default: throw new Error(`Unrecognized file type (magic: ${magic})`);
				}
				multi.attach(name, content, filename);
			});
			body.get2d().forEach(([key, value]) => {
				multi.attach(key, value);
			});
			const formData = multi.finish();
			const r = (this.main.options.instanceSSL ? https : http)
				.request({
					method,
					hostname: this.main.options.instanceHost,
					port: this.main.options.instancePort,
					path,
					headers: {
						"User-Agent": this.main.options.userAgent,
						"Content-Type": `multipart/form-data; boundary=${multi.boundary}`,
						"Host": this.main.options.instanceHost,
						...(this.auth === null ? {} : {
							Authorization: this.auth
						})
					}
				}, (req) => {
					const data: Array<Buffer> = [];
					req
						.on("error", (err) => reject(err))
						.on("data", (d) => data.push(d))
						.on("end", () => {
							console.log(JSON.parse(Buffer.concat(data).toString()));
							if (!req.statusCode || !req.statusMessage) reject(new Error("No Status Information"));
							if (req.statusCode === 204) return resolve(null);
							else if (req.statusCode === 200 || req.statusCode === 201) {
								try {
									resolve(JSON.parse(Buffer.concat(data).toString()));
								} catch {
									reject(new APIError("PARSE", req.statusCode, req.statusMessage!, method, path, "Multipart Form Data", Buffer.concat(data).toString()));
								}
							} else {
								let d: unknown | string;
								try {
									d = Buffer.concat(data).toString();
									d = JSON.parse(String(d));
								} catch {
									// ignore
								}

								reject(new APIError("UNEXPECTED", req.statusCode!, req.statusMessage!, method, path, "Multipart Form Data", d));
							}
						});
				});
			for (const chunk of formData) r.write(chunk);
			r.end();
		});
	}
}
