import type E621 from "..";
import { User } from "..";
import type { ModifyTakedownOptions, TakedownProperties, TakedownStatus } from "../types";

export default class Takedown implements TakedownProperties {
	private main: E621;
	id: number;
	status: TakedownStatus;
	approver_id: number | null;
	reason_hidden: boolean;
	created_at: string;
	updated_at: string;
	post_count: number;
	constructor(main: E621, info: TakedownProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value:        main,
			configurable: false,
			enumerable:   false,
			writable:     false
		});
	}

	/**
	 * Get the approver of this takedown
	 *
	 * @returns {Promise<User | null>}
	 */
	async getApprover() { return this.approver_id === null ?  null : this.main.users.get.call(this.main.users, this.approver_id); }

	/**
	 * modify this takedown
	 *
	 * * Requires Authentication
	 *
	 * * Requires Admin
	 *
	 * @param {object} options
	 * @param {boolean} [options.process_takedown] - if the takedown should be processed
	 * @param {string} [options.delete_reason] - the reason to add to posts that are deleted
	 * @param {Record<string | number, boolean>} [options.takedown_posts] - object of id-boolean values, false = keep, true = delete
	 * @param {string | Array<string>} [options.takedown_add_posts_tags] - list of tags to match and add to the takedown
	 * @param {number | Array<number>} [options.takedown_add_posts_ids] - list of posts to add to the takedown
	 * @param {("pending" | "inactive")} [options.status] - mark the takedown inactive or not
	 * @param {string} [options.notes] - admin notes
	 * @param {boolean} [options.reason_hidden] - if the reason should be hidden
	 * @returns {Promise<Takedown>}
	 */
	async modify(options: ModifyTakedownOptions) {
		this.main.request.authCheck.call(this, "Takedown#modify");
		return this.main.takedowns.modify.call(this.main.takedowns, this.id, options);
	}

	/**
	 * Delete this takedown
	 *
	 * * Requires Authentication
	 *
	 * * Requires Admin
	 *
	 * @returns {Promise<null>}
	 */
	async delete() {
		this.main.request.authCheck.call(this, "Takedown#delete");
		return this.main.takedowns.delete.call(this.main.takedowns, this.id);
	}
}
