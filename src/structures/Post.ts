import type PostSet from "./PostSet";
import type User from "./User";
import Pool from "./Pool";
import type { PostProperties, Ratings, ModifyPostOptions, PostVoteResult } from "../types";
import type E621 from "..";

export default class Post implements PostProperties {
	private main: E621;
	id: number;
	created_at: string;
	updated_at: string;
	file: {
		width: number;
		height: number;
		ext: string;
		size: number;
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
		// seems to be used for videos
		alternates: Record<string, {
			type: string;
			height: number;
			width: number;
			urls: Array<string | null>;
		}>;
	};
	score: Record<"up" | "down" | "total", number>;
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", Array<string>>;
	locked_tags: Array<string>;
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: Ratings;
	fav_count: number;
	sources: Array<string>;
	pools: Array<number>;
	relationships: {
		parent_id: number | null;
		has_childeren: boolean;
		has_active_childeren: boolean;
		childeren: Array<number>;
	};
	approver_id: number | null;
	uploader_id: number;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
	constructor(main: E621, info: PostProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});

		// blacklisted or deleted
		if (this.file.url === null) this.file.url = this.flags.deleted ? this.main.request.deletedImageURL : this.main.request.constructURL(this.file.md5, "original", this.file.ext);
		if (this.preview.url === null) this.preview.url = this.flags.deleted ? this.main.request.deletedImageURL : this.main.request.constructURL(this.file.md5, "preview", this.file.ext);
		if (this.sample.has && this.sample.url === null) this.sample.url = this.flags.deleted ? this.main.request.deletedImageURL : this.main.request.constructURL(this.file.md5, "sample", this.file.ext);
	}

	/**
	 * Get the user object for creator of this post
	 *
	 * @returns {Promise<User | null>}
	 */
	async getUploader() { return this.main.users.get(this.uploader_id); }

	/**
	 * Get the user object for approver of this post (will be null if self approved)
	 *
	 * @returns {Promise<User | null>}
	 */
	async getApprover() { return this.approver_id === null ? null : this.main.users.get(this.approver_id); }

	/**
	 * Add this post to a set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the set to add this post to
	 * @returns {Promise<PostSet>}
	 */
	async addToSet(id: number) {
		this.main.request.authCheck("Post#addToSet");
		return this.main.postSets.addPost(id, this.id);
	}

	/**
	 * Remove this post from a set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the set to remove this post from
	 * @returns {Promise<PostSet>}
	 */
	async removeFromSet(id: number) {
		this.main.request.authCheck("Post#removeFromSet");
		return this.main.postSets.removePost(id, this.id);
	}

	/**
	 * Add this post to a pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the pool to add this post to
	 * @returns {Promise<Pool>}
	 */
	async addToPool(id: number) {
		this.main.request.authCheck("Post#addToPool");
		return this.main.pools.addPost(id, this.id);
	}

	/**
	 * Remove this post from a pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the pool to remove this post from
	 * @returns {Promise<Pool>}
	 */
	async removeFromPool(id: number) {
		this.main.request.authCheck("Post#removeFromPool");
		return this.main.pools.removePost(id, this.id);
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
	async modify(options: ModifyPostOptions) {
		this.main.request.authCheck("Post#modify");
		return this.main.posts.modify(this.id, options);
	}

	/**
	 * Vote on this post
	 *
	 * * Requires Authentication
	 *
	 * @param {boolean} up - if the vote should be up or down
	 * @returns {Promise<PostVoteResult>}
	 */
	async vote(up: boolean) {
		this.main.request.authCheck("Post#vote");
		return this.main.posts.vote(this.id, up);
	}

	/**
	 * Remove tags from this post with implication checks (this WILL fire a request for EVERY SINGLE TAG specified.)
	 *
	 * @param tags
	 */
	async removeTagsWithImplicationChecks(tags: Array<string> | string) {
		if (!Array.isArray(tags)) tags =  tags.split(" ");
	}
}
