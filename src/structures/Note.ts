import type { NoteProperties } from "../types";
import type E621 from "..";
import { Post, User } from "..";

export default class Note implements NoteProperties {
	private main: E621;
	id: number;
	post_id: number;
	created_at: string;
	updated_at: string;
	creator_id: number | null;
	creator_name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	version: number;
	is_active: boolean;
	body: string;
	constructor(main: E621, info: NoteProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the creator of this note
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
}
