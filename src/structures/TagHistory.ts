import type User from "./User";
import type { TagHistoryProperties } from "../types";
import type E621 from "..";
import { Tag } from "../../build/src";

export default class TagHistory implements TagHistoryProperties {
	private main: E621;
	id: number;
	created_at: string;
	updated_at: string;
	old_type: number;
	new_type: number;
	is_locked: boolean;
	tag_id: number;
	creator_id: number;
	constructor(main: E621, info: TagHistoryProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the creator of this history
	 *
	 * @returns {Promise<User | null>}
	 */
	async getCreator() { return this.main.users.get.call(this.main.users, this.creator_id); }

	/**
	 * Get the tag object for this history
	 *
	 * @returns {Promise<Tag | null>}
	 */
	async getTag() { return this.main.tags.get.call(this.main.tags, this.tag_id); }
}
