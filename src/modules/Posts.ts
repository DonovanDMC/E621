import type E621 from "..";
import Post from "../structures/Post";
import PostApproval from "../structures/PostApproval";
import PostHistory from "../structures/PostHistory";
import type {
	CreatePostOptions,
	SearchPostsOptions,
	PostProperties,
	NewPost,
	ModifyPostOptions,
	PostVoteResult,
	SearchPostHistoryOptions,
	PostHistoryProperties,
	Ratings,
	SearchPostApprovalsOptions,
	PostApprovalProperties
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";

export default class Posts {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Posts) {
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

	/**
	 * Get a post by its id
	 *
	 * @param {(number | string)} id - The id of the post to get
	 * @returns {Promise<(Post | null)>}
	 */
	async get(id: number | string) {
		const res = await this.main.request.get<{ post: PostProperties; }>(`/posts/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Post(this.main, res.post);
	}

	/**
	 * Get a post by its md5
	 *
	 * @param {string} md5 - The md5 of the post to get
	 * @returns {Promise<(Post | null)>}
	 */
	async getByMD5(md5: string) {
		const res = await this.main.request.get<{ post: PostProperties; }>(`/posts.json?md5=${md5}`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Post(this.main, res.post);
	}

	/**
	 * Search for posts
	 *
	 * @param {object} [options]
	 * @param {(Array<string> | string)} [options.tags] - narrow the search by specific tags
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - number for exact page, a${number} posts after ${number}, b${number} posts before ${number}
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Post>>}
	 */
	async search(options?: SearchPostsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (Array.isArray(options.tags) || typeof options.tags === "string") qs.add("tags", Array.isArray(options.tags) ? options.tags.join(" ") : options.tags);
		if (typeof options.page !== "undefined") qs.add("page", options.page);
		if (typeof options.limit === "number" || typeof options.limit === "string") qs.add("limit", options.limit);
		const res = await this.main.request.get<{ posts: Array<PostProperties>; }>(`/posts.json?${qs.build()}`);
		return res!.posts.map(info => new Post(this.main, info));
	}

	/**
	 * Upload a post
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {(Array<string> | string)} options.tags - the tags for the post
	 * @param {Ratings} options.rating - the rating for the post
	 * @param {(Array<string> | string)} options.sources - the sources for the post (required, even if empty)
	 * @param {string} [options.description] - the description of the post
	 * @param {number} [options.parent_id] - the parent of the post
	 * @param {string} [options.referer_url] - dunno, api doc specifies it though
	 * @param {string} [options.md5_confirmation] - confirm of the md5 of the uploaded file
	 * @param {boolean} [options.as_pending] - upload as pending (requires approver)
	 * @param {boolean} [options.rating_locked] - upload as rating locked (requires privileged)
	 * @param {(Array<string> | string)} [options.locked_tags] - tags to lock on the post (requires admin)
	 * @param {Buffer} [options.file] - file upload (mutually exclusive with file_url, not well tested)
	 * @param {string} [options.file_url] - url of file to upload (mutually exclusive with file)
	 * @returns {Promise<number>}
	 */
	async create(options: CreatePostOptions) {
		this.main.request.authCheck.call(this, "Posts#create");
		if (!options) throw new Error("options is required for Posts#create");
		if (!("file_url" in options || "file" in options)) throw new Error("one of options.file, options.file_url is required for Posts#create");
		if ("file_url" in options && "file" in options) process.emitWarning("only one of options.file, options.file_url should be provided to Posts#create. options.file_url overrides options.file.");
		// e621 requires sources to be provided
		if (!options.sources) options.sources = "";
		const qs = new FormHelper();
		if (typeof options.tags                === "string")  qs.add("upload[tag_string]", options.tags);
		if (typeof options.sources             === "string")  qs.add("upload[source]", options.sources);
		if (typeof options.locked_tags         === "string")  qs.add("upload[locked_tags]", options.locked_tags);
		if (Array.isArray(options.tags)        && options.tags.length        > 0) qs.add("upload[tag_string]", options.tags.join(" "));
		if (Array.isArray(options.sources)     && options.sources.length     > 0) qs.add("upload[source]", options.sources.join("\n"));
		if (Array.isArray(options.locked_tags) && options.locked_tags.length > 0) qs.add("upload[locked_tags]", options.locked_tags.join("\n"));
		if (typeof options.rating              === "string")  qs.add("upload[rating]", options.rating);
		if (typeof options.description         === "string")  qs.add("upload[description]", options.description);
		if (typeof options.parent_id           === "number")  qs.add("upload[parent_id]", options.parent_id);
		if (typeof options.referer_url         === "string")  qs.add("upload[referer_url]", options.referer_url);
		if (typeof options.as_pending          === "boolean") qs.add("upload[as_pending]", options.as_pending);
		if (typeof options.md5_confirmation    === "string")  qs.add("upload[md5_confirmation]", options.md5_confirmation);
		if (typeof options.rating_locked       === "boolean") qs.add("upload[locked_rating]", options.rating_locked);
		let res: NewPost | null;
		if ("file_url" in options && typeof options.file_url === "string") {
			qs.add("upload[direct_url]", options.file_url);
			res = await this.main.request.post<NewPost>("/uploads.json", qs.build());
		} else if ("file" in options) {
			res = await this.main.request.postWithFile<NewPost>("/uploads.json", qs, [{ content: options.file, name: "upload[file]" }]);
		}
		return res!.post_id;
	}

	/**
	 * Modify a post
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} [options.edit_reason] - the reason for the edit
	 * @param {(Array<string> | string)} [options.add_tags] - the tags to add to the post
	 * @param {(Array<string> | string)} [options.remove_tags] - the tags to remove from the post
	 * @param {(Array<string> | string)} [options.add_sources] - the sources to add to the post
	 * @param {(Array<string> | string)} [options.remove_sources] - the sources to remove from the post
	 * @param {Ratings} [options.rating] - the rating for the post
	 * @param {string} [options.description] - the description of the post
	 * @param {number} [options.parent_id] - the parent of the post
	 * @param {boolean} [options.has_embedded_notes] - I don't know what this is, api docs list it though
	 * @param {boolean} [options.rating_locked] - upload as rating locked (requires privileged)
	 * @param {boolean} [options.note_locked] - upload as rating locked (requires janitor)
	 * @param {boolean} [options.status_locked] - upload as rating locked (requires admin)
	 * @param {boolean} [options.hide_from_anonymous] - upload as rating locked (requires admin)
	 * @param {boolean} [options.hide_from_search] - upload as rating locked (requires admin)
	 * @param {string} [options.background_color] - the background color of the post (requires janitor)
	 * @param {(Array<string> | string)} [options.locked_tags] - tags to lock on the post (requires admin)
	 * @returns {Promise<Post>}
	 */
	async modify(id: number, options: ModifyPostOptions) {
		this.main.request.authCheck.call(this, "Posts#modify");
		if (!options) throw new Error("options is required for Posts#modify");
		const qs = new FormHelper();
		let tagDiff = "", sourceDiff = "";
		if (typeof options.add_tags               === "string") tagDiff    += `${options.add_tags}\n`;
		if (Array.isArray(options.add_tags)       &&    options.add_tags.length       > 0) tagDiff    += `${options.add_tags.join(" ")}\n`;
		if (typeof options.remove_tags            === "string") tagDiff    += `${options.remove_tags.split(" ").map(t => `-${t}`).join(" ")}\n`;
		if (Array.isArray(options.remove_tags)    &&    options.remove_tags.length    > 0) tagDiff    += `${options.remove_tags.map(t => `-${t}`).join(" ")}\n`;
		if (typeof options.add_sources            === "string") sourceDiff += `${options.add_sources}\n`;
		if (Array.isArray(options.add_sources)    &&    options.add_sources.length    > 0) sourceDiff += `${options.add_sources.join("\n")}\n`;
		if (typeof options.remove_sources         === "string") sourceDiff += `${options.remove_sources.split("\n").map(s => `-${s}`).join("\n")}\n`;
		if (Array.isArray(options.remove_sources) &&    options.remove_sources.length > 0) sourceDiff += `${options.remove_sources.map(s => `-${s}`).join("\n")}\n`;
		if (tagDiff) qs.add("post[tag_string_diff]", tagDiff.trim());
		if (sourceDiff) qs.add("post[source_diff]", sourceDiff.trim());
		if (typeof options.locked_tags            === "string")  qs.add("post[locked_tags]", options.locked_tags);
		if (Array.isArray(options.locked_tags)    && options.locked_tags.length > 0) qs.add("post[locked_tags]", options.locked_tags.join("\n"));
		if (typeof options.rating                 === "string")  qs.add("post[rating]", options.rating);
		if (typeof options.description            === "string")  qs.add("post[description]", options.description);
		if (typeof options.parent_id              === "number")  qs.add("post[parent_id]", options.parent_id);
		if (typeof options.has_embedded_notes     === "boolean") qs.add("post[has_embedded_notes]", options.has_embedded_notes);
		if (typeof options.rating_locked          === "boolean") qs.add("post[is_rating_locked]", options.rating_locked);
		if (typeof options.note_locked            === "boolean") qs.add("post[is_note_locked]", options.note_locked);
		if (typeof options.status_locked          === "boolean") qs.add("post[is_status_locked]", options.status_locked);
		if (typeof options.hide_from_anonymous    === "boolean") qs.add("post[hide_from_anonymous]", options.hide_from_anonymous);
		if (typeof options.hide_from_search       === "boolean") qs.add("post[hide_from_search_engines]", options.hide_from_search);
		if (typeof options.background_color       === "string")  qs.add("post[bg_color]", options.background_color);
		if (typeof options.edit_reason            === "string")  qs.add("post[edit_reason]", options.edit_reason);
		const res = await this.main.request.patch<{ post: PostProperties; }>(`/posts/${id}.json`, qs.build());
		return new Post(this.main, res!.post);
	}

	// @TODO delete/approved/unapprove - not a high priority

	/**
	 * Revert a post to a previous version
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to revert
	 * @param {number} version_id - the version id to revert to (see history)
	 */
	async revert(id: number, version_id: number) {
		this.main.request.authCheck.call(this, "Posts#revert");
		const qs = new FormHelper()
			.add("version_id", version_id);
		return this.main.request.put<null>(`/posts/${id}/revert.json`, qs.build());
	}

	/**
	 * Get a specific post history
	 *
	 * @param {number} id - the id of the history to get
	 * @returns {Promise<PostHistory | null>}
	 */
	async getHistory(id: number) { return this.searchHistory({ id }).then(r => r.length === 0 ? null : r[0]); }

	/**
	 * Search the post history
	 *
	 * * Requires Authentication
	 *
	 * @param {object} [options]
	 * @param {number} [options.id] - get a specific post history entry
	 * @param {string} [options.user] - narrow the results by username
	 * @param {number} [options.user_id] - narrow the results by user id
	 * @param {number} [options.post] - narrow the results by post id
	 * @param {string} [options.reason] - narrow the results by edit reason
	 * @param {string} [options.description] - narrow the results by description content
	 * @param {Ratings} [options.rating_changed_to] - narrow the results by rating change
	 * @param {Ratings} [options.final_rating] - narrow the results by final rating
	 * @param {number} [options.parent] - narrow the results by parent id
	 * @param {number} [options.parent_changed_to] - narrow the results by changed parent id
	 * @param {(Array<string> | string)} [options.final_tags] - narrow the results by final tags
	 * @param {(Array<string> | string)} [options.added_tags] - narrow the results by added tags
	 * @param {(Array<string> | string)} [options.removed_tags] - narrow the results by removed tags
	 * @param {(Array<string> | string)} [options.final_locked_tags] - narrow the results by final locked tags
	 * @param {(Array<string> | string)} [options.added_locked_tags] - narrow the results by added locked tags
	 * @param {(Array<string> | string)} [options.removed_locked_tags] - narrow the results by removed locked tags
	 * @param {string} [options.source] - narrow the results by sources
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<PostHistory>>}
	 */
	async searchHistory(options?: SearchPostHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.id                          === "number")    qs.add("search[id]", options.id);
		if (typeof options.user                        === "string")    qs.add("search[updater_name]", options.user);
		if (typeof options.user_id                     === "number")    qs.add("search[updater_id]", options.user_id);
		if (typeof options.post                        === "number")    qs.add("search[post_id]", options.post);
		if (typeof options.reason                      === "string")    qs.add("search[reason]", options.reason);
		if (typeof options.description                 === "string")    qs.add("search[description]", options.description);
		if (typeof options.rating_changed_to           === "string")    qs.add("search[rating_changed]", options.rating_changed_to);
		if (typeof options.final_rating                === "string")    qs.add("search[rating]", options.final_rating);
		if (typeof options.parent                      === "number")    qs.add("search[parent_id]", options.parent);
		if (typeof options.parent_changed_to           === "string")    qs.add("search[parent_id_changed]", options.parent_changed_to);
		if (typeof options.final_tags                  === "string")    qs.add("search[tags]", options.final_tags);
		if (Array.isArray(options.final_tags)          &&    options.final_tags.length > 0)          qs.add("search[tags]", options.final_tags.join(" "));
		if (typeof options.added_tags                  === "string")    qs.add("search[tags_added]", options.added_tags);
		if (Array.isArray(options.added_tags)          &&    options.added_tags.length > 0)          qs.add("search[tags_added]", options.added_tags.join(" "));
		if (typeof options.removed_tags                === "string")    qs.add("search[tags_removed]", options.removed_tags);
		if (Array.isArray(options.removed_tags)        &&    options.removed_tags.length > 0)        qs.add("search[tags_removed]", options.removed_tags.join(" "));
		if (typeof options.final_locked_tags           === "string")    qs.add("search[locked_tags]", options.final_locked_tags);
		if (Array.isArray(options.final_locked_tags)   &&    options.final_locked_tags.length > 0)   qs.add("search[locked_tags]", options.final_locked_tags.join(" "));
		if (typeof options.added_locked_tags           === "string")    qs.add("search[locked_tags_added]", options.added_locked_tags);
		if (Array.isArray(options.added_locked_tags)   &&    options.added_locked_tags.length > 0)   qs.add("search[locked_tags_added]", options.added_locked_tags.join(" "));
		if (typeof options.removed_locked_tags         === "string")    qs.add("search[locked_tags_removed]", options.removed_locked_tags);
		if (Array.isArray(options.removed_locked_tags) &&    options.removed_locked_tags.length > 0) qs.add("search[locked_tags_removed]", options.removed_locked_tags.join(" "));
		if (typeof options.source                      === "string")    qs.add("search[source]", options.source);
		if (typeof options.page                        !== "undefined") qs.add("page", options.page);
		if (typeof options.limit                       === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<PostHistoryProperties>>(`/post_versions.json?${qs.build()}`);
		return res!.map(info => new PostHistory(this.main, info));
	}

	/**
	 * Vote on a post
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to vote on
	 * @param {boolean} up - if the vote should be up or down
	 * @returns {Promise<PostVoteResult>}
	 */
	async vote(id: number, up: boolean) {
		this.main.request.authCheck.call(this, "Posts#vote");
		const qs = new FormHelper()
			.add("score", up ? 1 : -1);
		const res = await this.main.request.post<PostVoteResult>(`/posts/${id}/votes.json`, qs.build());
		return res!;
	}

	/**
	 * Get a specific post approval
	 *
	 * @param {number} id - the id of the approval to get
	 * @returns {Promise<PostApproval | null>}
	 */
	async getPostApproval(id: number) { return this.searchPostApprovals({ id }).then(r => r.length === 0 ? null : r[0]); }

	/**
	 * Search the post approvals
	 *
	 * @param {object} [options]
	 * @param {number} [options.id] - get a specific post approvals entry
	 * @param {string} [options.approver] - filter by the username of the user that approved the post
	 * @param {(Array<string> | string)} [options.tags] - filter by the tags on the post
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<PostApproval>>}
	 */
	async searchPostApprovals(options?: SearchPostApprovalsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.id                         === "number")    qs.add("search[id]", options.id);
		if (typeof options.approver                   === "string")    qs.add("search[user_name]", options.approver);
		if (typeof options.tags                       === "number")    qs.add("search[post_tags_match]", options.tags);
		if (Array.isArray(options.tags) && options.tags.length > 0)    qs.add("search[post_tags_match]", options.tags.join(" "));
		if (typeof options.page                       !== "undefined") qs.add("page", options.page);
		if (typeof options.limit                      === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<PostApprovalProperties>>(`/post_approvals.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "post_approvals" in res) return [];
		return res!.map(info => new PostApproval(this.main, info));
	}
}
