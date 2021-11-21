import type Artist from "./Artist";
import type User from "./User";
import type { ArtistHistoryProperties } from "../types";
import type E621 from "..";

export default class ArtistHistory implements ArtistHistoryProperties {
	private main: E621;
	id: number;
	artist_id: number;
	name: string;
	updater_id: number;
	is_active: boolean;
	group_name: string;
	is_banned: boolean;
	notes_changed: boolean;
	created_at: string;
	updated_at: string;
	other_names: Array<string>;
	urls: Array<string>;
	constructor(main: E621, info: ArtistHistoryProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the updater for this history
	 *
	 * @returns {Promise<User | null>}
	 */
	async getUpdater() { return this.main.users.get.call(this.main.users, this.updater_id); }

	/**
	 * Get the artist object for this history
	 *
	 * @returns {Promise<Artist | null>}
	 */
	async getArtist() { return this.main.artists.get.call(this.main.pools, this.artist_id); }


	/**
	 * Revert the wiki page to this version
	 *
	 * * Requires Authentication
	 *
	 */
	async revertTo() {
		this.main.request.authCheck("ArtistHistory#revertTo");
		return this.main.artists.revert.call(this.main.pools, this.artist_id, this.id);
	}
}
