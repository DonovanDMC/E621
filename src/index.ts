import * as https from "https";
import pkg from "../package.json";

export class APIError extends Error {
	code: number;
	errmessage: string;
	method: string;
	endpoint: string;
	constructor(code: number, message: string, method: string, endpoint: string) {
		super(`Unexpected ${code} ${message} on ${method} ${endpoint}`);
		this.name = "APIError";
		this.code = code;
		this.errmessage = message;
		this.method = method;
		this.endpoint = endpoint;
		switch (code) {
			case 400: this.name = "APIError[BadRequest]"; break;
			case 401: this.name = "APIError[Unauthorized]"; break;
			case 403: this.name = "APIError[Forbidden]"; break;
			case 404: this.name = "APIError[NotFound]"; break;
			case 429: this.name = "APIError[RateLimited]"; break;
		}
	}
}

export interface Post {
	id: string;
	created_at: string;
	updated_at: string;
	file: {
		width: number;
		height: number;
		ext: string;
		md5: string;
		url: string;
	};
	preview: {
		width: number;
		height: number;
		url: string;
	};
	sample: {
		has: boolean;
		height: number;
		width: number;
		url: string;
		alternates: {}; // @TODO
	};
	score: {
		up: number;
		down: number;
		total: number;
	};
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", string[]>;
	locked_tags: string[];
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: "s" | "q" | "e";
	fav_count: number;
	sources: string[];
	pools: number[];
	relationships: {
		parent_id: number | null;
		has_children: boolean;
		has_active_children: boolean;
		children: number[]
	};
	approver_id: number | null;
	uploader_id: number | null;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
}

export interface NullableURLPost {
	id: string;
	created_at: string;
	updated_at: string;
	file: {
		width: number;
		height: number;
		ext: string;
		md5: string;
		url: string | null;
	};
	preview: {
		width: number;
		height: number;
		url: string | null;
	};
	sample: {
		has: boolean;
		height: number;
		width: number;
		url: string | null;
		alternates: {}; // @TODO
	};
	score: {
		up: number;
		down: number;
		total: number;
	};
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", string[]>;
	locked_tags: string[];
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: "s" | "q" | "e";
	fav_count: number;
	sources: string[];
	pools: number[];
	relationships: {
		parent_id: number | null;
		has_children: boolean;
		has_active_children: boolean;
		children: number[]
	};
	approver_id: number | null;
	uploader_id: number | null;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
}


class E621<N extends boolean = true> {
	apiKey: string | null;
	username: string | null;
	blacklist: string[];
	userAgent: string;
	fixNullURLs: boolean;
	/**
	 * Construct an instance of E621
	 * @param {string} [apiKey] - an api key to use for requests 
	 * @param {string[]} [blacklist=[]] - a list of tags to use to filter out posts 
	 * @param {string }[userAgent] - A user agent to use for requests 
	 * @param {boolean} [fixNullURLs=true] - If null urls should be converted to proper urls
	 * @example new E621();
	 * @example new E621("YourAPIKey", "YourUsername");
	 * @example new E621("YourAPIKey", "YourUsername", ["watersports"]);
	 * @example new E621("YourAPIKey", "YourUsername", ["watersports"], "MyAwesomeProject/1.0.0");
	 * @example new E621("YourAPIKey", "YourUsername", ["watersports"], "MyAwesomeProject/1.0.0", false);
	 */
	constructor(apiKey?: string, username?: string, blacklist?: string[], userAgent?: string, fixNullURLs?: N) {
		this.apiKey = apiKey || null;
		this.username = username || null;
		this.blacklist = blacklist || [];
		this.userAgent = userAgent || `E621/${pkg.version} (https://github.com/FurryBotCo/E621)`;
		this.fixNullURLs = fixNullURLs ?? true;
	}

	private get auth() { return this.username && this.apiKey ? Buffer.from(`${this.username}:${this.apiKey}`).toString("base64") : null; }

	/**
	 * Get posts from e621
	 * @param {string[]} [tags=[]] - The tags to fetch posts for, 40 max
	 * @param {number} [limit=25] - The, maximum amount of posts to get, 320 max 
	 * @param {number} [page=1] - The page of posts to get, see {@link https://e621.net/help/api#posts_list|E621 API Posts#List}
	 * @returns {Promise<(Post | NullableURLPost)[]>}
	 * @example getPosts()
	 * @example getPosts(["male/male"]);
	 * @example getPosts(["male/male"], 5);
	 * @example getPosts(["male/male"], 5, 1);
	 */
	async getPosts(tags?: string[], limit?: number, page?: number | string): Promise<(N extends true ? Post : NullableURLPost)[]> {
		if (tags && tags.length > 40) throw new TypeError("You may only supply up to 40 tags.");
		if (limit && limit > 320) throw new TypeError("You may only request up to 320 posts at a time.");

		return new Promise<any>((a, b) =>
			https
				.request({
					method: "GET",
					host: "e621.net",
					path: `/posts.json?${tags ? `tags=${encodeURIComponent(tags.join(" "))}&` : ""}${limit ? `limit=${limit}&` : ""}${page ? `page=${page}&` : ""}`,
					headers: {
						"User-Agent": this.userAgent,
						...(this.auth ? {
							"Authorization": this.auth
						} : {})
					}
				}, (res) => {
					const data: Buffer[] = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", "/posts.json");
							} else {
								if (this.fixNullURLs) return a(this.filterPosts(JSON.parse(Buffer.concat(data).toString()).posts).map(this.fixURL.bind(this)));
								else return a(this.filterPosts(JSON.parse(Buffer.concat(data).toString()).posts));
							}
						});
				})
				.end()
		);
	}

	/**
	 * Get a specifc post from e621, by id
	 * @param {number} id - The id of the post to get
	 * @returns {Promise<(Post | NullableURLPost)>}
	 * @example getPostById(1391357)
	 */
	async getPostById(id: number): Promise<(N extends true ? Post : NullableURLPost)> {
		if (isNaN(id) || id < 1 || !id) throw new TypeError("Invalid id provided.");
		return new Promise<any>((a, b) =>
			https
				.request({
					method: "GET",
					host: "e621.net",
					path: `/posts/${id}.json`,
					headers: {
						"User-Agent": this.userAgent,
						...(this.auth ? {
							"Authorization": this.auth
						} : {})
					}
				}, (res) => {
					const data: Buffer[] = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", `/posts/${id}.json`);
							} else {
								if (this.fixNullURLs) return a(this.fixURL(JSON.parse(Buffer.concat(data).toString()).post));
								else return a(JSON.parse(Buffer.concat(data).toString()).post);
							}
						});
				})
				.end()
		);
	}


	/**
	 * Get a specifc post from e621, by md5
	 * @param {string} md5 - the md5 of the post to get
	 * @returns {Promise<(Post | NullableURLPost)>}
	 * @example getPostById("6fd0b0f2237543bfeee5ca9318a97b46")
	 */
	async getPostByMD5(md5: string): Promise<(N extends true ? Post : NullableURLPost)> {
		// md5 hashes are always 32 characters
		if (!md5 || md5.length !== 32) throw new TypeError("Invalid md5 provided.");
		return new Promise<any>((a, b) =>
			https
				.request({
					method: "GET",
					host: "e621.net",
					path: `/posts.json?md5=${md5}`,
					headers: {
						"User-Agent": this.userAgent,
						...(this.auth ? {
							"Authorization": this.auth
						} : {})
					}
				}, (res) => {
					const data: Buffer[] = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", `/posts.json?md5=${md5}`);
							} else {
								if (this.fixNullURLs) return a(this.fixURL(JSON.parse(Buffer.concat(data).toString()).post));
								else return a(JSON.parse(Buffer.concat(data).toString()).post);
							}
						});
				})
				.end()
		);
	}

	private filterPosts(p: (Post | NullableURLPost)[]) {
		return p.filter(v => !this.blacklist.some(bl => Object.values(v.tags).reduce((a, b) => a.concat(b), []).includes(bl)));
	}

	/**
	 * Convert null urls on a post into proper urls.
	 * @param {NullableURLPost} p - The post to fix
	 * @returns {Post} 
	 */
	fixURL(p: NullableURLPost) {
		if (p.file.url === null) p.file.url = this.constructURLFromMD5(p.file.md5, p.file.ext, false);
		if (p.preview.url === null) p.preview.url = this.constructURLFromMD5(p.file.md5, p.file.ext, true);
		if (p.sample.url === null) p.sample.url = this.constructURLFromMD5(p.file.md5, p.file.ext, false);
		return p as Post;
	}

	/**
	 * Construct a url from its md5 counterpart
	 * @param {string} md5 - the md5
	 * @param {string} [ext="png"] - The extension, assumed png if not provided
	 * @param {boolean} [preview=false] 
	 */
	constructURLFromMD5(md5: string, ext = "png", preview = false) {
		return `https://static1.e621.net/data${preview ? "/preview" : ""}/${md5.slice(0, 2)}/${md5.slice(2, 4)}/${md5}.${ext}`;
	}
}

export default E621;
export { E621 };
module.exports = E621;
