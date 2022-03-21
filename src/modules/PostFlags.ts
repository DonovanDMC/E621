import type E621 from "..";
import type {
	PostFlagProperties,
	SearchPostFlagsOptions,
	CreatePostFlagOptions,
	PostFlagCategory,
	PostFlagReasons
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";
import PostFlag from "../structures/PostFlag";

export default class PostFlags {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: PostFlags) {
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

	/**
	 * Get a post flag by its id
	 *
	 * @param {number} id - The id of the post flag to get
	 * @returns {Promise<(PostFlag | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<PostFlagProperties>(`/post_flags/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new PostFlag(this.main, res);
	}

	/**
	 * Search for post flags
	 *
	 * @param {object} [options]
	 * @param {string} [options.reason] - narrow the results by the provided reason
	 * @param {(string | Array<string>)} [options.tags] - narrow the results by the tags of the flagged post
	 * @param {number} [options.post_id] - narrow the results by the id of the post flag
	 * @param {number} [options.creator] - narrow the results by the creator name of the post flag (requires janitor if not self)
	 * @param {number} [options.creator_id] - narrow the results by the creator id of the post flag (requires janitor if not self)
	 * @param {number} [options.ip_addres] - narrow the results by the creator ip of the post flag (requries moderator)
	 * @param {boolean} [options.resolved] - if the flag as been marked as resolved
	 * @param {PostFlagCategory} [options.category] - narrow the results by the category of the post flag
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<PostFlag>>}
	 */
	async search(options?: SearchPostFlagsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.reason       === "string")    qs.add("search[reason_matches]", options.reason);
		if (typeof options.tags         === "string")    qs.add("search[post_tags_match]", options.tags);
		if (Array.isArray(options.tags) && options.tags.length > 0) qs.add("search[post_tags_match]", options.tags.join(" "));
		if (typeof options.post_id      === "number")    qs.add("search[post_id]", options.post_id);
		if (typeof options.creator      === "string")    qs.add("search[creator_name]", options.creator);
		if (typeof options.creator_id   === "string")    qs.add("search[creator_id]", options.creator_id);
		if (typeof options.ip_address   === "string")    qs.add("search[ip_addr]", options.ip_address);
		if (typeof options.resolved     === "boolean")   qs.add("search[is_resolved]", options.resolved);
		if (typeof options.category     === "string")    qs.add("search[creator_name]", options.category);
		if (typeof options.page         !== "undefined") qs.add("page", options.page);
		if (typeof options.limit        === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<PostFlagProperties>>(`/notes.json?${qs.build()}`);
		return res!.map(info => new PostFlag(this.main, info));
	}

	/**
	 * Create a post flag
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {number} options.post_id - the id of the post to flag
	 * @param {PostFlagReasons} options.reason_name - the reason for flagging the post
	 * @param {number} [options.parent_id] - a post id for `previously_deleted` & `inferior`
	 * @returns {Promise<PostFlag>}
	 */
	async create(options: CreatePostFlagOptions) {
		this.main.request.authCheck.call(this, "PostFlag#create");
		if (!options) throw new Error("options is required in Notes#create");
		const qs = new FormHelper()
			.add("post_flag[post_id]", options.post_id)
			.add("post_flag[reason_name]", options.reason_name);
		if (typeof options.parent_id === "number") qs.add("post_flag[parent_id]", options.parent_id);
		const res = await this.main.request.post<PostFlagProperties>("/post_flags.json", qs.build());
		return new PostFlag(this.main, res!);
	}

	/**
	 * Unflag a post
	 *
	 * * Requires Authentication
	 *
	 * * Requires Janitor
	 *
	 * @param {number} postID - the id of post to unflag
	 * @returns {Promise<null>}
	 */
	async delete(postID: number) {
		this.main.request.authCheck.call(this, "PostFlags#delete");
		return this.main.request.delete<null>(`/post_flags/${postID}.json`);
	}
}
