import type { BlipProperties, BlipWarningType, ModifyBlipOptions } from "../types";
import type E621 from "..";
import type { User } from "..";

export default class Blip implements BlipProperties {
	private main: E621;
	id: number;
	creator_id: number;
	creator_name: string;
	body: string;
	response_to: number | null;
	created_at: string;
	updated_at: string;
	is_hidden: boolean;
	/** the type of warning shown on this blip - 1 = warning - 2 = record - 3 = ban */
	warning_type: 1 | 2 | 3;
	/** the user that created the warning present on the blip  */
	warning_user_id: number | null;
	constructor(main: E621, info: BlipProperties) {
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
	 * Get the blip this one responded to
	 *
	 * @returns {Promise<Blip | null>}
	 */
	async getResponseTo() { return this.response_to === null ? null : this.main.blips.get.call(this.main.blips, this.response_to); }
	/**
	 * modify a blip
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator if not created by self
	 *
	 * * blips older than 5 minutes cannot be edited (does not apply if moderator)
	 *
	 * @param {object} options
	 * @param {string} options.body - the body content of the blip
	 * @returns {Promise<Blip>}
	 */
	async modify(options: ModifyBlipOptions) {
		this.main.request.authCheck.call(this, "Blip#modify");
		if (!options) throw new Error("options is required in Blip#modify");
	}
	/**
	 * Delete this blip
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @returns {Promise<null>}
	 */
	async delete() {
		this.main.request.authCheck.call(this, "Blips#delete");
		return this.main.blips.delete.call(this.main.blips, this.id);
	}

	/**
	 * Add a warning to a blip
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {BlipWarningType} type - the type of warning to display
	 * @returns {Promise<Blip>}
	 */
	async addWarning(type: BlipWarningType) {
		this.main.request.authCheck.call(this, "Blip#addWarning");
		return this.main.blips.addWarning.call(this.main.blips, this.id, type);
	}
}
