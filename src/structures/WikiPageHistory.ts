import type WikiPage from "./WikiPage";
import type User from "./User";
import type { WikiPageHistoryProperties } from "../types";
import type E621 from "..";

export default class WikiPageHistory implements WikiPageHistoryProperties {
	private main: E621;
	id: number;
	wiki_page_id: number;
	updater_id: number;
	title: string;
	body: string;
	is_locked: boolean;
	created_at: string;
	updated_at: string;
	other_names: Array<string>;
	is_deleted: boolean;
	reason: string;
	constructor(main: E621, info: WikiPageHistoryProperties) {
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
	async getUpdater() { return this.main.users.get(this.updater_id); }

	/**
	 * Get the wiki page object for this history
	 *
	 * @returns {Promise<WikiPage | null>}
	 */
	async getWikiPage() { return this.main.pools.get(this.wiki_page_id); }


	/**
	 * Revert the wiki page to this version
	 *
	 * * Requires Authentication
	 *
	 */
	async revertTo() {
		this.main.request.authCheck("WikiPageHistory#revertTo");
		return this.main.pools.revert(this.wiki_page_id, this.id);
	}
}
