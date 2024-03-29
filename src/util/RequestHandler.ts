/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type FormHelper from "./FormHelper";
import MultipartData from "./MultipartData";
import Debug from "./Debug";
import Timer from "./Timer";
import type E621 from "..";
import * as http from "http";
import * as https from "https";
export class APIError extends Error {
	name = "APIError";
	type: "UNEXPECTED" | "PARSE" | "UNKNOWN" | "BLIP_OLD";
	statusCode: number;
	statusMessage: string;
	method: string;
	path: string;
	reqBody: string | null;
	reqBodyDecoded: Record<string, unknown> | null;
	resBody: unknown | null;
	constructor(type: APIError["type"], statusCode: number, statusMessage: string, method: string, path: string, reqBody: string | null, resBody: unknown | null) {
		if (type === "UNEXPECTED") super(`Unexpected ${statusCode} ${statusMessage} on "${method.toUpperCase()} ${path}"`);
		else if (type === "PARSE") super(`Parse Error on "${method.toUpperCase()} ${path}"`);
		else if (type === "BLIP_OLD") super(`Blips older than 5 minutes cannot be edited on "${method.toUpperCase()} ${path}"`);
		else super(`Unknown Error on "${method.toUpperCase()} ${path}" (${statusCode} ${statusMessage})`);

		this.name = `APIError[${type || "UNKNOWN"}]`;
		this.type = type;
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.method = method;
		this.path = path;
		this.reqBody = reqBody;
		this.reqBodyDecoded = null;
		if (reqBody) {
			try {
				this.reqBodyDecoded = decodeURIComponent(reqBody).split("&").map(v => ({ [v.split("=")[0]]: v.split("=")[1] })).reduce((a, b) => ({ ...a, ...b }), {});
			} catch {
				// ignore
			}
		}
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
				enumerable:   false
			},
			main: {
				value:        main,
				configurable: false,
				enumerable:   false,
				writable:     false
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
		const start = Timer.now();
		Debug("requestHandler", `-> GET ${path}`);
		return new Promise<T | null>((resolve, reject) => {
			const r = (this.main.options.instanceSSL ? https : http)
				.request({
					method:   "GET",
					timeout:  this.main.options.requestTimeout * 1000,
					hostname: this.main.options.instanceHost,
					port:     this.main.options.instancePort,
					path,
					headers:  {
						"User-Agent": this.main.options.userAgent,
						"Host":       this.main.options.instanceHost,
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
							const end = Timer.now();
							Debug("requestHandler", `<- GET ${path} - ${req.statusCode!} ${req.statusMessage!} [${Buffer.concat(data).toString().length}] - ${Timer.calc(start, end, 3)}`);
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
				.setTimeout(this.main.options.requestTimeout * 1000, () => {
					r.destroy(new Error(`Request Went Over The Limit Of ${this.main.options.requestTimeout * 1000}ms`));
				});
			r.end();
		});
	}

	async post<T = unknown>(path: string, body?: string) { return this.other<T>("POST", path, body); }
	async postWithFile<T = unknown>(path: string, body: FormHelper, files: Array<{ content: Buffer; name: string; }>) { return this.otherWithFile<T>("POST", path, body, files); }
	async patch<T = unknown>(path: string, body?: string) { return this.other<T>("PATCH", path, body); }
	async put<T = unknown>(path: string, body?: string) { return this.other<T>("PUT", path, body); }
	async delete<T = unknown>(path: string, body?: string) { return this.other<T>("DELETE", path, body); }

	async other<T = unknown>(method: string, path: string, body?: string) {
		const start = Timer.now();
		Debug("requestHandler", `-> ${method} ${path}`);
		return new Promise<T | null>((resolve, reject) => {
			const r = (this.main.options.instanceSSL ? https : http)
				.request({
					method,
					timeout:  this.main.options.requestTimeout * 1000,
					hostname: this.main.options.instanceHost,
					port:     this.main.options.instancePort,
					path,
					headers:  {
						"User-Agent":   this.main.options.userAgent,
						"Content-Type": "application/x-www-form-urlencoded",
						"Host":         this.main.options.instanceHost,
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
							const end = Timer.now();
							Debug("requestHandler", `<- ${method} ${path} - ${req.statusCode!} ${req.statusMessage!} [${Buffer.concat(data).toString().length}] - ${Timer.calc(start, end, 3)}`);
							if (!req.statusCode || !req.statusMessage) reject(new Error("No Status Information"));
							if (req.statusCode === 204) return resolve(null);
							else if (req.statusCode === 200 || req.statusCode === 201) {
								try {
									resolve(JSON.parse(Buffer.concat(data).toString()));
								} catch {
									reject(new APIError("PARSE", req.statusCode, req.statusMessage!, method, path, body ?? null, Buffer.concat(data).toString()));
								}
							} else {
								// Editing a blip older than 5 minutes returns a 302 Found
								if (req.statusCode === 302 && /\/blips\/\d+\.json/.test(path)) throw new APIError("BLIP_OLD", req.statusCode, req.statusMessage!, method, path, body ?? null, Buffer.concat(data).toString());
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
				})
				.setTimeout(this.main.options.requestTimeout * 1000, () => {
					r.destroy(new Error(`Request Went Over The Limit Of ${this.main.options.requestTimeout * 1000}ms`));
				});
			if (body) r.write(body);
			r.end();
		});
	}

	// the things I do for zero dependencies
	// not well tested at all
	async otherWithFile<T = unknown>(method: string, path: string, body: FormHelper, files: Array<{ content: Buffer; name: string; }>) {
		const start = Timer.now();
		Debug("requestHandler", `-> ${method} ${path}`);
		return new Promise<T | null>((resolve, reject) => {
			const multi = new MultipartData();
			files.forEach(({ content, name }, i) => {
				const magic = [...(new Uint8Array(content.slice(0, 4)))].map(v => v.toString(16).toUpperCase()).join("");
				let filename;
				switch (magic) {
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
					timeout:  this.main.options.requestTimeout * 1000,
					hostname: this.main.options.instanceHost,
					port:     this.main.options.instancePort,
					path,
					headers:  {
						"User-Agent":   this.main.options.userAgent,
						"Content-Type": `multipart/form-data; boundary=${multi.boundary}`,
						"Host":         this.main.options.instanceHost,
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
							const end = Timer.now();
							Debug("requestHandler", `<- ${method} ${path} - ${req.statusCode!} ${req.statusMessage!} [${Buffer.concat(data).toString().length}] - ${Timer.calc(start, end, 3)}`);
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
				})
				.setTimeout(this.main.options.requestTimeout * 1000, () => {
					r.destroy(new Error(`Request Went Over The Limit Of ${this.main.options.requestTimeout * 1000}ms`));
				});
			for (const chunk of formData) r.write(chunk);
			r.end();
		});
	}

	get instanceURL() {
		return `http${this.main.options.instanceSSL ? "s" : ""}://${this.main.options.instanceHost}${[80, 443].includes(this.main.options.instancePort) ? "" : `:${this.main.options.instancePort}`}`;
	}

	// the deleted image url is on the instance itself by default
	get deletedImageURL() {
		return `${this.instanceURL}/images/deleted-preview.png`;
	}

	constructURL(md5: string, type: "original" | "preview" | "sample", ext = "png") {
		if (this.main.options.reconstructStaticURL) return this.main.options.reconstructStaticURL(md5, type, ext);
		switch (this.main.options.imageReconstructionType) {
			case "e621": return `https://static1.e621.net/data/${type === "original" ? "" : `${type}/`}${md5.slice(0, 2)}/${md5.slice(2, 4)}/${md5}.${ext}`;
			case "yiffy": return `https://v3.yiff.media/${type === "original" ? "" : `${type}/`}${md5.slice(0, 2)}/${md5.slice(2, 4)}/${md5}.${ext}`;
			case "dev": return `${this.instanceURL}/data/${type === "original" ? "" : `${type}/`}${md5}.${ext}`;
			default: throw new Error(`Image reconstruction failed with no implemented method (type: ${String(this.main.options.imageReconstructionType)}, host: ${this.main.options.instanceHost})`);
		}
	}
}
