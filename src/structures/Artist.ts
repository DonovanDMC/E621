import type { ArtistProperties, ArtistURL, ModifyArtistOptions } from "../types";
import type E621 from "..";

export default class Artist implements ArtistProperties {
	private main: E621;
	id: number;
	name: string;
	updated_at: string;
	is_active: boolean;
	other_names: Array<string>;
	group_name: string;
	linked_user_id: number | null;
	created_at: string;
	is_banned: boolean;
	creator_id: number;
	is_locked: boolean;
	notes: string | null;
	domains: Array<string>;
	urls: Array<ArtistURL>;
	constructor(main: E621, info: ArtistProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}


	/**
	 * modify an artist
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} [options.name] - the name of artist (requires janitor)
	 * @param {number} [options.linkedUserID] - the id of the user associated with this artist (requires janitor)
	 * @param {boolean} [options.locked] - if the artist should be locked (requires janitor)
	 * @param {(Array<string> | string)} [options.otherNames] - the other names for this artist
	 * @param {string} [options.groupName] - the group name of this artist
	 * @param {(Array<string> | string)} [options.urls] - the urls associated with this artist
	 * @param {string} [options.notes] - notes for this artist
	 * @returns {Promise<Artist>}
	 */
	async modify(options: ModifyArtistOptions) {
		this.main.request.authCheck("Artist#modify");
		if (!options) throw new Error("options is required in Artist#modify");
		return this.main.artists.modify.call(this.main.artists, this.id, options);
	}
}
