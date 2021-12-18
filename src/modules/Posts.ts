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
	 * @param {number} [options.parentID] - the parent of the post
	 * @param {string} [options.refererURL] - dunno, api doc specifies it though
	 * @param {string} [options.md5Confirmation] - confirm of the md5 of the uploaded file
	 * @param {boolean} [options.asPending] - upload as pending (requires approver)
	 * @param {boolean} [options.ratingLocked] - upload as rating locked (requires privileged)
	 * @param {(Array<string> | string)} [options.lockedTags] - tags to lock on the post (requires admin)
	 * @param {Buffer} [options.file] - file upload (mutually exclusive with fileURL, not well tested)
	 * @param {string} [options.fileURL] - url of file to upload (mutually exclusive with file)
	 * @returns {Promise<number>}
	 */
	async create(options: CreatePostOptions) {
		this.main.request.authCheck.call(this, "Posts#create");
		if (!options) throw new Error("options is required for Posts#create");
		if (!("fileURL" in options || "file" in options)) throw new Error("one of options.file, options.fileURL is required for Posts#create");
		if ("fileURL" in options && "file" in options) process.emitWarning("only one of options.file, options.fileURL should be provided to Posts#create. options.fileURL overrides options.file.");
		// e621 requires sources to be provided
		if (!options.sources) options.sources = "";
		const qs = new FormHelper();
		if (typeof options.tags            === "string")  qs.add("upload[tag_string]", options.tags);
		if (typeof options.sources         === "string")  qs.add("upload[source]", options.sources);
		if (typeof options.lockedTags      === "string")  qs.add("upload[locked_tags]", options.lockedTags);
		if (Array.isArray(options.tags)       && options.tags.length       > 0) qs.add("upload[tag_string]", options.tags.join(" "));
		if (Array.isArray(options.sources)    && options.sources.length    > 0) qs.add("upload[source]", options.sources.join("\n"));
		if (Array.isArray(options.lockedTags) && options.lockedTags.length > 0) qs.add("upload[locked_tags]", options.lockedTags.join("\n"));
		if (typeof options.rating          === "string")  qs.add("upload[rating]", options.rating);
		if (typeof options.description     === "string")  qs.add("upload[description]", options.description);
		if (typeof options.parentID        === "number")  qs.add("upload[parent_id]", options.parentID);
		if (typeof options.refererURL      === "string")  qs.add("upload[referer_url]", options.refererURL);
		if (typeof options.asPending       === "boolean") qs.add("upload[as_pending]", options.asPending);
		if (typeof options.md5Confirmation === "string")  qs.add("upload[md5_confirmation]", options.md5Confirmation);
		if (typeof options.ratingLocked    === "boolean") qs.add("upload[locked_rating]", options.ratingLocked);
		let res: NewPost | null;
		if ("fileURL" in options && typeof options.fileURL === "string") {
			qs.add("upload[direct_url]", options.fileURL);
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
	 * @param {string} [options.editReason] - the reason for the edit
	 * @param {(Array<string> | string)} [options.addTags] - the tags to add to the post
	 * @param {(Array<string> | string)} [options.removeTags] - the tags to remove from the post
	 * @param {(Array<string> | string)} [options.addSources] - the sources to add to the post
	 * @param {(Array<string> | string)} [options.removeSources] - the sources to remove from the post
	 * @param {Ratings} [options.rating] - the rating for the post
	 * @param {string} [options.description] - the description of the post
	 * @param {number} [options.parentID] - the parent of the post
	 * @param {boolean} [options.hasEmbeddedNotes] - I don't know what this is, api docs list it though
	 * @param {boolean} [options.ratingLocked] - upload as rating locked (requires privileged)
	 * @param {boolean} [options.noteLocked] - upload as rating locked (requires janitor)
	 * @param {boolean} [options.statusLocked] - upload as rating locked (requires admin)
	 * @param {boolean} [options.hideFromAnonymous] - upload as rating locked (requires admin)
	 * @param {boolean} [options.hideFromSearch] - upload as rating locked (requires admin)
	 * @param {string} [options.backgroundColor] - the background color of the post (requires janitor)
	 * @param {(Array<string> | string)} [options.lockedTags] - tags to lock on the post (requires admin)
	 * @returns {Promise<Post>}
	 */
	async modify(id: number, options: ModifyPostOptions) {
		this.main.request.authCheck.call(this, "Posts#modify");
		if (!options) throw new Error("options is required for Posts#modify");
		const qs = new FormHelper();
		let tagDiff = "", sourceDiff = "";
		if (typeof options.addTags       === "string") tagDiff    += options.addTags;
		if (Array.isArray(options.addTags)       &&    options.addTags.length       > 0) tagDiff    += options.addTags.join(" ");
		if (typeof options.removeTags    === "string") tagDiff    += options.removeTags.split(" ").map(t => `-${t}`).join(" ");
		if (Array.isArray(options.removeTags)    &&    options.removeTags.length    > 0) tagDiff    += ` ${options.removeTags.map(t => `-${t}`).join(" ")}`;
		if (typeof options.addSources    === "string") sourceDiff += options.addSources;
		if (Array.isArray(options.addSources)    &&    options.addSources.length    > 0) sourceDiff += options.addSources.join("\n");
		if (typeof options.removeSources === "string") sourceDiff += options.removeSources.split("\n").map(s => `-${s}`).join("\n");
		if (Array.isArray(options.removeSources) &&    options.removeSources.length > 0) sourceDiff += ` ${options.removeSources.map(s => `-${s}`).join("\n")}`;
		if (tagDiff) qs.add("post[tag_string_diff]", tagDiff.trim());
		if (sourceDiff) qs.add("post[source_diff]", sourceDiff.trim());
		if (typeof options.lockedTags        === "string")  qs.add("post[locked_tags]", options.lockedTags);
		if (Array.isArray(options.lockedTags) && options.lockedTags.length > 0) qs.add("post[locked_tags]", options.lockedTags.join("\n"));
		if (typeof options.rating            === "string")  qs.add("post[rating]", options.rating);
		if (typeof options.description       === "string")  qs.add("post[description]", options.description);
		if (typeof options.parentID          === "number")  qs.add("post[parent_id]", options.parentID);
		if (typeof options.hasEmbeddedNotes  === "boolean") qs.add("post[has_embedded_notes]", options.hasEmbeddedNotes);
		if (typeof options.ratingLocked      === "boolean") qs.add("post[is_rating_locked]", options.ratingLocked);
		if (typeof options.noteLocked        === "boolean") qs.add("post[is_note_locked]", options.noteLocked);
		if (typeof options.statusLocked      === "boolean") qs.add("post[is_status_locked]", options.statusLocked);
		if (typeof options.hideFromAnonymous === "boolean") qs.add("post[hide_from_anonymous]", options.hideFromAnonymous);
		if (typeof options.hideFromSearch    === "boolean") qs.add("post[hide_from_search_engines]", options.hideFromSearch);
		if (typeof options.backgroundColor   === "string")  qs.add("post[bg_color]", options.backgroundColor);
		if (typeof options.editReason        === "string")  qs.add("post[edit_reason]", options.editReason);
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
	 * @param {number} versionID - the version id to revert to (see history)
	 */
	async revert(id: number, versionID: number) {
		this.main.request.authCheck.call(this, "Posts#revert");
		const qs = new FormHelper()
			.add("version_id", versionID);
		return this.main.request.put<null>(`/posts/${id}/revert.json`, qs.build());
	}

	/**
	 * Search the post history
	 *
	 * * Requires Authentication
	 *
	 * @param {object} [options]
	 * @param {string} [options.user] - narrow the results by username
	 * @param {number} [options.userID] - narrow the results by user id
	 * @param {number} [options.post] - narrow the results by post id
	 * @param {string} [options.reason] - narrow the results by edit reason
	 * @param {string} [options.description] - narrow the results by description content
	 * @param {Ratings} [options.ratingChangedTo] - narrow the results by rating change
	 * @param {Ratings} [options.finalRating] - narrow the results by final rating
	 * @param {number} [options.parent] - narrow the results by parent id
	 * @param {number} [options.parentChangedTo] - narrow the results by changed parent id
	 * @param {(Array<string> | string)} [options.finalTags] - narrow the results by final tags
	 * @param {(Array<string> | string)} [options.addedTags] - narrow the results by added tags
	 * @param {(Array<string> | string)} [options.removedTags] - narrow the results by removed tags
	 * @param {(Array<string> | string)} [options.finalLockedTags] - narrow the results by final locked tags
	 * @param {(Array<string> | string)} [options.addedLockedTags] - narrow the results by added locked tags
	 * @param {(Array<string> | string)} [options.removedLockedTags] - narrow the results by removed locked tags
	 * @param {string} [options.source] - narrow the results by sources
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<PostHistory>>}
	 */
	async searchHistory(options?: SearchPostHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.user              === "string")    qs.add("search[updater_name]", options.user);
		if (typeof options.userID            === "number")    qs.add("search[updater_id]", options.userID);
		if (typeof options.post              === "number")    qs.add("search[post_id]", options.post);
		if (typeof options.reason            === "string")    qs.add("search[reason]", options.reason);
		if (typeof options.description       === "string")    qs.add("search[description]", options.description);
		if (typeof options.ratingChangedTo   === "string")    qs.add("search[rating_changed]", options.ratingChangedTo);
		if (typeof options.finalRating       === "string")    qs.add("search[rating]", options.finalRating);
		if (typeof options.parent            === "number")    qs.add("search[parent_id]", options.parent);
		if (typeof options.parentChangedTo   === "string")    qs.add("search[parent_id_changed]", options.parentChangedTo);
		if (typeof options.finalTags         === "string")    qs.add("search[tags]", options.finalTags);
		if (typeof options.addedTags         === "string")    qs.add("search[tags_added]", options.addedTags);
		if (typeof options.removedTags       === "string")    qs.add("search[tags_removed]", options.removedTags);
		if (typeof options.finalLockedTags   === "string")    qs.add("search[locked_tags]", options.finalLockedTags);
		if (typeof options.addedLockedTags   === "string")    qs.add("search[locked_tags_added]", options.addedLockedTags);
		if (typeof options.removedLockedTags === "string")    qs.add("search[locked_tags_removed]", options.removedLockedTags);
		if (typeof options.source            === "string")    qs.add("search[source]", options.source);
		if (typeof options.page              !== "undefined") qs.add("page", options.page);
		if (typeof options.limit             === "number")    qs.add("limit", options.limit);
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
	 * Search the post approvals
	 *
	 * @param {object} [options]
	 * @param {string} [options.approver] - filter by the username of the user that approved the post
	 * @param {(Array<string> | string)} [options.tags] - filter by the tags on the post
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<PostApproval>>}
	 */
	async searchPostApprovals(options?: SearchPostApprovalsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.approver                   === "string") qs.add("search[user_name]", options.approver);
		if (typeof options.tags                       === "number") qs.add("search[post_tags_match]", options.tags);
		if (Array.isArray(options.tags) && options.tags.length > 0) qs.add("search[post_tags_match]", options.tags.join(" "));
		if (typeof options.page                    !== "undefined") qs.add("page", options.page);
		if (typeof options.limit                      === "number") qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<PostApprovalProperties>>(`/post_approvals.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "post_approvals" in res) return [];
		return res!.map(info => new PostApproval(this.main, info));
	}
}
