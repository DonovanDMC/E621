import pkg from "../package.json";
import * as https from "https";

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
	id: number;
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
		alternates: Record<string, unknown>; // @TODO
	};
	score: {
		up: number;
		down: number;
		total: number;
	};
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", Array<string>>;
	locked_tags: Array<string>;
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: "s" | "q" | "e";
	fav_count: number;
	sources: Array<string>;
	pools: Array<number>;
	relationships: {
		parent_id: number | null;
		has_children: boolean;
		has_active_children: boolean;
		children: Array<number>;
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
	id: number;
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
		alternates: Record<string, unknown>; // @TODO
	};
	score: {
		up: number;
		down: number;
		total: number;
	};
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", Array<string>>;
	locked_tags: Array<string>;
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: "s" | "q" | "e";
	fav_count: number;
	sources: Array<string>;
	pools: Array<number>;
	relationships: {
		parent_id: number | null;
		has_children: boolean;
		has_active_children: boolean;
		children: Array<number>;
	};
	approver_id: number | null;
	uploader_id: number | null;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
}

export interface UploadLimit {
	id: number;
	created_at: number;
	name: string;
	level: number;
	base_upload_limit: number;
	post_upload_count: number;
	post_update_count: number;
	note_update_count: number;
	is_banned: boolean;
	can_approve_posts: boolean;
	can_upload_free: boolean;
	level_string: string;
	avatar_id: number;
	show_avatars: boolean;
	blacklist_avatars: boolean;
	blacklist_users: boolean;
	description_collapsed_initially: boolean;
	hide_comments: boolean;
	show_hidden_comments: boolean;
	show_post_statistics: boolean;
	has_mail: boolean;
	receive_email_notifications: boolean;
	enable_keyboard_navigation: boolean;
	enable_privacy_mode: boolean;
	style_usernames: boolean;
	enable_auto_complete: boolean;
	has_saved_searches: boolean;
	disable_cropped_thumbnails: boolean;
	disable_mobile_gestures: boolean;
	enable_safe_mode: boolean;
	disable_responsive_mode: boolean;
	disable_post_tooltips: boolean;
	no_flagging: boolean;
	no_feedback: boolean;
	disable_user_dmails: boolean;
	enable_compact_uploader: boolean;
	updated_at: string;
	email: string;
	last_logged_in_at: string;
	last_forum_read_at: string;
	recent_tags: string;
	comment_threshold: number;
	default_image_size: string;
	favorite_tags: string;
	blacklisted_tags: string;
	time_zone: string;
	per_page: number;
	custom_style: string;
	favorite_count: number;
	api_regen_multiplier: number;
	api_burst_limit: number;
	remaining_api_limit: number;
	statement_timeout: number;
	favorite_limit: number;
	tag_query_limit: number;
}


class E621<N extends boolean = true> {
	apiKey: string | null;
	username: string | null;
	blacklist: Array<string>;
	userAgent: string;
	fixNullURLs: boolean;
	baseDomain: string;
	setHost: boolean;
	/**
	 * Construct an instance of E621
	 *
	 * @param {string} [username] - your e621 username to use for requests
	 * @param {string} [apiKey] - an api key to use for requests
	 * @param {string[]} [blacklist=[]] - a list of tags to use to filter out posts
	 * @param {string }[userAgent] - A user agent to use for requests
	 * @param {boolean} [fixNullURLs=true] - If null urls should be converted to proper urls
	 * @param {string} [baseDomain=this.baseDomain] - The domain to use for api requests
	 * @param {boolean} [setHost=false] - If we should set the Host header on requests to e621.net (useful for proxies).
	 * @example new E621();
	 * @example new E621("YourUsername", "YourAPIKey");
	 * @example new E621("YourUsername", "YourAPIKey", ["male/male"]);
	 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0");
	 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0", false);
	 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0", false, "mye621.local");
	 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0", false, "mye621.local", false);
	 */
	constructor(username?: string, apiKey?: string, blacklist?: Array<string>, userAgent?: string, fixNullURLs?: N, baseDomain?: string, setHost?: boolean) {
		this.username = username || null;
		this.apiKey = apiKey || null;
		this.blacklist = blacklist || [];
		this.userAgent = userAgent || `E621/${pkg.version} (https://github.com/FurryBotCo/E621)`;
		this.fixNullURLs = fixNullURLs ?? true;
		this.baseDomain = baseDomain ?? "e621.net";
		this.setHost = !!setHost;
	}

	private get auth() {
		return this.username && this.apiKey ? Buffer.from(`${this.username}:${this.apiKey}`).toString("base64") : null;
	}

	/**
	 * Get posts from e621
	 *
	 * @param {string[]} [tags=[]] - The tags to fetch posts for, 40 max
	 * @param {number} [limit=25] - The, maximum amount of posts to get, 320 max
	 * @param {number} [page=1] - The page of posts to get, see {@link https://e621.net/help/api#posts_list|E621 API Posts#List}
	 * @returns {Promise<(Post | NullableURLPost)[]>}
	 * @example getPosts()
	 * @example getPosts("male bulge");
	 * @example getPosts(["male", "bulge"]);
	 * @example getPosts(["male", "bulge"], 5);
	 * @example getPosts(["male", "bulge"], 5, 1);
	 */
	async getPosts(tags?: Array<string> | string, limit?: number, page?: number | string): Promise<Array<N extends true ? Post : NullableURLPost>> {
		if (tags && !Array.isArray(tags)) tags = tags.split(" ");
		if (tags && tags.length > 40) throw new TypeError("You may only supply up to 40 tags.");
		if (limit && limit > 320) throw new TypeError("You may only request up to 320 posts at a time.");

		// eslint-disable-next-line
		return new Promise<any>((a, b) =>
			https
				.request({
					method: "GET",
					host: this.baseDomain,
					path: `/posts.json?${tags ? `tags=${encodeURIComponent((tags as Array<string>).join(" "))}&` : ""}${limit ? `limit=${limit}&` : ""}${page ? `page=${page}&` : ""}`,
					headers: {
						"User-Agent": this.userAgent,
						...(this.auth ? {
							Authorization: this.auth
						} : {}),
						...(this.setHost ? {
							Host: "e621.net"
						} : {})
					}
				}, (res) => {
					const data: Array<Buffer> = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", "/posts.json");
							} else {
								if (this.fixNullURLs) return a(this.filterPosts((JSON.parse(Buffer.concat(data).toString()) as { posts: Array<Post>; }).posts).map(this.fixURL.bind(this)));
								else return a(this.filterPosts((JSON.parse(Buffer.concat(data).toString()) as { posts: Array<NullableURLPost>; }).posts));
							}
						});
				})
				.end()
		);
	}

	/**
	 * Get a specifc post from e621, by id
	 *
	 * @param {number} id - The id of the post to get
	 * @returns {Promise<(Post | NullableURLPost)>}
	 * @example getPostById(1022094)
	 */
	async getPostById(id: number): Promise<(N extends true ? Post : NullableURLPost)> {
		if (isNaN(id) || id < 1 || !id) throw new TypeError("Invalid id provided.");
		// eslint-disable-next-line
		return new Promise<any>((a, b) =>
			https
				.request({
					method: "GET",
					host: this.baseDomain,
					path: `/posts/${id}.json`,
					headers: {
						"User-Agent": this.userAgent,
						...(this.auth ? {
							Authorization: this.auth
						} : {}),
						...(this.setHost ? {
							Host: "e621.net"
						} : {})
					}
				}, (res) => {
					const data: Array<Buffer> = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", `/posts/${id}.json`);
							} else {
								if (this.fixNullURLs) return a(this.fixURL((JSON.parse(Buffer.concat(data).toString()) as { post: Post; }).post));
								else return a((JSON.parse(Buffer.concat(data).toString()) as { post: Post; }).post);
							}
						});
				})
				.end()
		);
	}


	/**
	 * Get a specifc post from e621, by md5
	 *
	 * @param {string} md5 - the md5 of the post to get
	 * @returns {Promise<(Post | NullableURLPost)>}
	 * @example getPostByMD5("6fd0b0f2237543bfeee5ca9318a97b46")
	 */
	async getPostByMD5(md5: string): Promise<(N extends true ? Post : NullableURLPost)> {
		// md5 hashes are always 32 characters
		if (!md5 || md5.length !== 32) throw new TypeError("Invalid md5 provided.");
		// eslint-disable-next-line
		return new Promise<any>((a, b) =>
			https
				.request({
					method: "GET",
					host: this.baseDomain,
					path: `/posts.json?md5=${md5}`,
					headers: {
						"User-Agent": this.userAgent,
						...(this.auth ? {
							Authorization: this.auth
						} : {}),
						...(this.setHost ? {
							Host: "e621.net"
						} : {})
					}
				}, (res) => {
					const data: Array<Buffer> = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", `/posts.json?md5=${md5}`);
							} else {
								if (this.fixNullURLs) return a(this.fixURL((JSON.parse(Buffer.concat(data).toString()) as { post: Post; }).post));
								else return a((JSON.parse(Buffer.concat(data).toString()) as { post: NullableURLPost; }).post);
							}
						});
				})
				.end()
		);
	}

	/**
	 * Get a specifc post from e621, by md5
	 *
	 * @param {number} id - the id of the post to edit
	 * @param {string} [reason="Edit via https://npm.im/e621"] - The edit reason
	 * @param {string} [tagChanges] - the tags to change, see {@link https://e621.net/help/api#posts_update|Posts Update Documentation} (list tag to add, list tag with a minus to remove)
	 * @param {string} [sourceChanges] - the sources to change, see {@link https://e621.net/help/api#posts_update|Posts Update Documentation} (same as above, with sources)
	 * @param {number} [parentId] - the id of the parent of this image
	 * @param {string} [description] - the description of this image
	 * @param {("s"|"q"|"e")} [rating] - the rating of this image
	 * @param {boolean} [ratingLocked] - if the rating of this image should be locked
	 * @param {boolean} [noteLocked] - if this image should be note locked
	 * @param {boolean} [hasEmbeddedNotes] - if this image has embedded notes
	 * @returns {Promise<(Post | NullableURLPost)>}
	 * @example editPost(1022094, "I dunno", "dog -cat")
	 * @example editPost(1022094, "I dunno", undefined, "-https://furaffinity.net/(...) https://inkbunny.net/(...)")
	 * @example editPost(1022094, "I dunno", undefined, undefined, 1097929)
	 * @example editPost(1022094, "I dunno", undefined, undefined, undefined, "Some stuff here")
	 * @example editPost(1022094, "I dunno", undefined, undefined, undefined, undefined, "e")
	 * @example editPost(1022094, "I dunno", undefined, undefined, undefined, undefined, undefined, true)
	 * @example editPost(1022094, "I dunno", undefined, undefined, undefined, undefined, undefined, undefined, false)
	 * @example editPost(1022094, "I dunno", undefined, undefined, undefined, undefined, undefined, undefined, undefined, true)
	 */
	async editPost(id: number, reason?: string, tagChanges?: string, sourceChanges?: string, parentId?: number, description?: string, rating?: "s" | "q" | "e", ratingLocked?: boolean, noteLocked?: boolean, hasEmbeddedNotes?: boolean): Promise<(N extends true ? Post : NullableURLPost)> {
		if (isNaN(id) || id < 1 || !id) throw new TypeError("Invalid id provided.");
		if (!this.auth) throw new Error("Authentication is required to use this.");
		const p = await this.getPostById(id);
		const q = [
			`post[edit_reason]=${encodeURIComponent(reason ? reason : "Edit via https://npm.im/e621")}`
		];
		if (tagChanges) q.push(`post[tag_string_diff]=${encodeURIComponent(tagChanges)}`);
		if (sourceChanges) q.push(`post[source_diff]=${encodeURIComponent(sourceChanges)}`);
		if (parentId) q.push(`post[parent_id]=${parentId}`, `post[old_parent_id]=${p.relationships.parent_id ?? "null"}`);
		if (description) q.push(`post[description]=${encodeURIComponent(description)}`, `post[old_description]=${encodeURIComponent(p.description)}`);
		if (rating) q.push(`post[rating]=${rating}`, `post[old_rating]=${p.rating}`);
		if (ratingLocked) q.push(`post[is_rating_locked]=${ratingLocked ? "true" : "false"}`);
		if (noteLocked) q.push(`post[is_note_locked]=${noteLocked ? "true" : "false"}`);
		if (hasEmbeddedNotes) q.push(`post[has_embedded_notes]=${hasEmbeddedNotes ? "true" : "false"}`);

		// eslint-disable-next-line
		return new Promise<any>((a, b) => {
			const req = https
				.request({
					method: "PATCH",
					host: this.baseDomain,
					path: `/posts/${id}.json`,
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"User-Agent": this.userAgent,
						"Authorization": this.auth!,
						...(this.setHost ? {
							Host: "e621.net"
						} : {})
					}
				}, (res) => {
					const data: Array<Buffer> = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "PATCH", `/posts/${id}.json`);
							} else {
								if (this.fixNullURLs) return a(this.fixURL((JSON.parse(Buffer.concat(data).toString()) as { post: Post; }).post));
								else return a((JSON.parse(Buffer.concat(data).toString()) as { post: NullableURLPost; }).post);
							}
						});
				});
			req.write(q.join("&"));
			req.end();
		});
	}

	/**
	 *
	 * @param {string} fileURL - the url of the file to send to Discord
	 * @param {(string[]|string)} tags - the tags to put on the post -- if you upload a post with less than 4 tags, e621 mods will not like you
	 * @param {("s"|"q"|"e")} rating - the rating for the image
	 * @param {(string[]|string)} [sources] - The sources of the image
	 * @param {string} [description] - A description for the post
	 * @param {number} [parent] - id of the parent post of this image
	 * @param {string} [referer] - I dunno
	 * @param {string} [md5Confirmation] - the md5 of the provided fileURL, to confirm it matches
	 * @example createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e")
	 * @example createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"])
	 * @example createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here")
	 * @example createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here", 1234)
	 * @example createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here", 1234, "https://npm.im/e621")
	 * @example createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here", 1234, "https://npm.im/e621", "abcdefghijklmnopqrstuvwxyz123456")
	 * @returns
	 */
	async createPost(fileURL: string, tags: string | Array<string>, rating: "s" | "q" | "e", sources?: Array<string> | string, description?: string, parent?: number, referer?: string, md5Confirmation?: string): Promise<{ success: boolean; location: string; post_id: number; }> {
		if (!this.auth) throw new Error("Authentication is required to use this.");
		const q = [
			`upload[direct_url]=${encodeURIComponent(fileURL)}`,
			`upload[tag_string]=${encodeURIComponent(Array.isArray(tags) ? tags.join(" ") : tags)}`,
			`upload[rating]=${rating}`
		];
		if (sources) q.push(`upload[source]=${encodeURIComponent(Array.isArray(sources) ? sources.join(" ") : sources)}`);
		if (description) q.push(`upload[description]=${encodeURIComponent(description)}`);
		if (parent) q.push(`upload[parent_id]=${parent}`);
		if (referer) q.push(`upload[referer]=${encodeURIComponent(referer)}`);
		if (md5Confirmation) q.push(`upload[md5_confirmation]=${md5Confirmation}`);

		// eslint-disable-next-line
		return new Promise<any>((a, b) => {
			const req = https
				.request({
					method: "POST",
					host: this.baseDomain,
					path: "/uploads.json",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"User-Agent": this.userAgent,
						"Authorization": this.auth!,
						...(this.setHost ? {
							Host: "e621.net"
						} : {})
					}
				}, (res) => {
					const data: Array<Buffer> = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "POST", "/uploads.json");
							} else return a((JSON.parse(Buffer.concat(data).toString())));
						});
				});
			req.write(q.join("&"));
			req.end();
		});
	}

	private filterPosts(p: Array<Post | NullableURLPost>) {
		return p.filter((v) => !this.blacklist.some((bl) => Object.values(v.tags).reduce((a, b) => a.concat(b), []).includes(bl)));
	}

	/**
	 * Convert null urls on a post into proper urls.
	 *
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
	 *
	 * @param {string} md5 - the md5
	 * @param {string} [ext="png"] - The extension, assumed png if not provided
	 * @param {boolean} [preview=false]
	 */
	constructURLFromMD5(md5: string, ext = "png", preview = false) {
		return `https://static1.e621.net/data${preview ? "/preview" : ""}/${md5.slice(0, 2)}/${md5.slice(2, 4)}/${md5}.${ext}`;
	}

	/**
	 * Fetch your "upload limit" info (this seems to just be general account info, along with upload limit)
	 *
	 * authentication is REQUIRED
	 *
	 * @returns {Promise<UploadLimit>}
	 */
	async getUploadLimit() {
		return new Promise<UploadLimit>((a, b) => {
			if (!this.auth) return b("E621#getUploadLimit requires authentication.");
			https
				.request({
					method: "GET",
					host: this.baseDomain,
					path: "/users/upload_limit.json",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"User-Agent": this.userAgent,
						"Authorization": this.auth,
						...(this.setHost ? {
							Host: "e621.net"
						} : {})
					}
				}, (res) => {
					const data: Array<Buffer> = [];

					res
						.on("data", (d) => data.push(d))
						.on("error", b)
						.on("end", () => {
							if (res.statusCode === undefined) throw new Error("recieved undefined statusCode");
							if (res.statusCode !== 200) {
								throw new APIError(res.statusCode, res.statusMessage!, "GET", "/users/upload_limit.json");
							} else return a((JSON.parse(Buffer.concat(data).toString()) as unknown as UploadLimit));
						});
				}).end();
		});
	}
}

export default E621;
export { E621 };
module.exports = E621;
