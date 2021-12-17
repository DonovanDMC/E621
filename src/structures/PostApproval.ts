import type User from "./User";
import type { PostApprovalProperties } from "../types";
import type E621 from "..";
import { Post } from "..";

export default class PostApproval implements PostApprovalProperties {
	private main: E621;
	id: number;
	user_id: number;
	post_id: number;
	created_at: string;
	updated_at: string;
	constructor(main: E621, info: PostApprovalProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the approver of this post
	 *
	 * @returns {Promise<User | null>}
	 */
	async getApprover() { return this.main.users.get.call(this.main.users, this.user_id); }

	/**
	 * Get the post object related to this approval
	 *
	 * @returns {Promise<Post | null>}
	 */
	async getPost() { return this.main.posts.get.call(this.main.posts, this.post_id); }
}
