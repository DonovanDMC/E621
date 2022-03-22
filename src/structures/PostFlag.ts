import type { PostFlagCategory, PostFlagProperties } from "../types";
import type E621 from "..";
import type { Post, User } from "..";

export default class PostFlag implements PostFlagProperties {
	private main: E621;
	id: number;
	created_at: string;
	updated_at: string;
	post_id: number;
	reason: string;
	creator_id: number;
	is_resolved: boolean;
	is_deletion: boolean;
	category: PostFlagCategory;
	constructor(main: E621, info: PostFlagProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the creator of this post flag
	 *
	 * @returns {Promise<User | null>}
	 */
	async getCreator() { return this.creator_id === null ? null : this.main.users.get.call(this.main.users, this.creator_id); }

	/**
	 * Get the post this note is on
	 *
	 * @returns {Promise<Post | null>}
	 */
	async getPost() { return this.main.posts.get.call(this.main.posts, this.post_id); }

	/**
	 * Unflag this post
	 *
	 * * Requires Authentication
	 *
	 * * Requires Janitor
	 *
	 * @returns {Promise<null>}
	 */
	async delete() { return this.main.postFlags.delete.call(this.main.posts, this.post_id); }
}
