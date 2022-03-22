import Note from "./Note";
import type { NoteHistoryProperties } from "../types";
import type E621 from "..";
import { Post, User } from "..";

export default class NoteHistory implements NoteHistoryProperties {
	private main: E621;
	id: number;
	note_id: number;
	post_id: number;
	created_at: string;
	updated_at: string;
	updater_id: number | null;
	x: number;
	y: number;
	width: number;
	height: number;
	body: string;
	version: number;
	is_active: boolean;
	constructor(main: E621, info: NoteHistoryProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value:        main,
			configurable: false,
			enumerable:   false,
			writable:     false
		});
	}

	/**
	 * Get the updater for this history
	 *
	 * @returns {Promise<User | null>}
	 */
	async getUpdater() { return this.updater_id === null ? null : this.main.users.get.call(this.main.users, this.updater_id); }

	/**
	 * Get the post for this history
	 *
	 * @returns {Promise<Post | null>}
	 */
	async getPost() { return this.main.posts.get.call(this.main.posts, this.post_id); }

	/**
	 * Get the post for this history
	 *
	 * @returns {Promise<Note | null>}
	 */
	async getNote() { return this.main.posts.get.call(this.main.posts, this.note_id); }
}
