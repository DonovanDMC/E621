import type E621 from "..";
import WikiPage from "../structures/WikiPage";
import type {
	WikiPageProperties,
	SearchWikiPagesOptions,
	CreateWikiPageOptions,
	ModifyWikiPageOptions,
	SearchWikiPagesOrder,
	SearchWikiPageHistoryOptions,
	WikiPageHistoryProperties
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";
import WikiPageHistory from "../structures/WikiPageHistory";

export default class WikiPages {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: WikiPages) {
					return !this.main.options.authUser || !this.main.options.authKey ? null : `Basic ${Buffer.from(`${this.main.options.authUser}:${this.main.options.authKey}`).toString("base64")}`;
				},
				configurable: false,
				enumerable:   false
			},
			main: {
				value:        main,
				configurable: false,
				enumerable:   false,
				writable:     false
			}
		});
	}

	/**
	 * Get a wiki page by its id
	 *
	 * @param {number} id - The id of the wiki page to get
	 * @returns {Promise<(WikiPage | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<WikiPageProperties>(`/wiki_pages/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new WikiPage(this.main, res);
	}


	/**
	 * Get a wiki page by its title
	 *
	 * @param {string} title - The title of the wiki page to get
	 * @returns {Promise<(WikiPage | null)>}
	 */
	async getByTitle(title: string) {
		return this.search({
			title,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Search for wiki pages
	 *
	 * @param {object} [options]
	 * @param {string} [options.title] - narrow the results by the title of the wiki page
	 * @param {string} [options.creator] - narrow the results by the (name of the) creator of the wiki page
	 * @param {string} [options.body] - narrow the results by the content of the wiki page
	 * @param {string} [options.otherNames] - narrow the results by the other names of the wiki page
	 * @param {boolean} [options.hasOtherNames] - narrow the results by the wiki page having other names
	 * @param {boolean} [options.hideDeleted] - narrow the results by the wiki page being deleted or not
	 * @param {SearchWikiPagesOrder} [options.order] - the order of the results
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<WikiPage>>}
	 */
	async search(options?: SearchWikiPagesOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.title         === "string")     qs.add("search[title]", options.title);
		if (typeof options.creator       === "string")     qs.add("search[creator_name]", options.creator);
		if (typeof options.body          === "string")     qs.add("search[body_matches]", options.body);
		if (typeof options.otherNames    === "string")     qs.add("search[other_names_match]", options.otherNames);
		if (typeof options.hasOtherNames === "boolean")    qs.add("search[other_names_present]", options.hasOtherNames);
		if (typeof options.hideDeleted   === "boolean")    qs.add("search[hide_deleted]", options.hideDeleted);
		if (typeof options.order         === "string")     qs.add("search[order]", options.order);
		if (typeof options.page          !== "undefined")  qs.add("page", options.page);
		if (typeof options.limit         === "number")     qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<WikiPageProperties>>(`/wiki_pages.json?${qs.build()}`);
		return res!.map(info => new WikiPage(this.main, info));
	}

	/**
	 * Create a wiki page
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} options.title - the name of the wiki page
	 * @param {string} options.body - the content of the wiki page
	 * @param {boolean} [options.locked] - if the wiki page should be locked (requires janitor)
	 * @param {boolean} [options.forceOverwrite] - if existing pages should be overwritten (requires janitor)
	 * @param {string} [options.reason] - the reson for creating the page
	 * @returns {Promise<WikiPage>}
	 */
	async create(options: CreateWikiPageOptions) {
		this.main.request.authCheck.call(this, "WikiPages#create");
		if (!options) throw new Error("options is required in WikiPages#create");
		const qs = new FormHelper()
			.add("wiki_page[title]", options.title)
			.add("wiki_page[body]", options.body);
		if (typeof options.locked         === "boolean") qs.add("wiki_page[is_locked]", options.locked);
		if (typeof options.forceOverwrite === "boolean") qs.add("wiki_page[skip_secondary_validations]", options.forceOverwrite);
		if (typeof options.reason         === "string")  qs.add("wiki_page[edit_reason]", options.reason);
		const res = await this.main.request.post<WikiPageProperties>("/wiki_pages.json", qs.build());
		return new WikiPage(this.main, res!);
	}

	/**
	 * modify a wiki page
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the wiki page to edit
	 * @param {object} options
	 * @param {string} [options.name] - the name of the wiki page (requires janitor)
	 * @param {string} [options.body] - the content of the wiki page
	 * @param {boolean} [options.locked] - if the wiki page is locked (requires janitor)
	 * @param {boolean} [options.forceOverwrite] - if existing pages should be overwritten (title change, requires janitor)
	 * @param {string} [options.reason] - the reason for the edit
	 * @returns {Promise<WikiPage>}
	 */
	async modify(id: number, options: ModifyWikiPageOptions) {
		this.main.request.authCheck.call(this, "WikiPages#modify");
		if (!options) throw new Error("options is required in WikiPages#modify");
		const qs = new FormHelper();
		if (typeof options.title          === "string")  qs.add("wiki_page[title]", options.title);
		if (typeof options.body           === "string")  qs.add("wiki_page[body]", options.body);
		if (typeof options.locked         === "boolean") qs.add("wiki_page[is_locked]", options.locked);
		if (typeof options.forceOverwrite === "boolean") qs.add("wiki_page[skip_secondary_validations]", options.forceOverwrite);
		if (typeof options.reason         === "string")  qs.add("wiki_page[edit_reason]", options.reason);
		const res = await this.main.request.patch<WikiPageProperties>(`/wiki_pages/${id}.json`, qs.build());
		return new WikiPage(this.main, res!);
	}

	/**
	 * Delete a wiki page
	 *
	 * * Requires Authentication
	 *
	 * * Requires Janitor
	 *
	 * @param {number} id - the id of the wiki page to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "WikiPages#delete");
		return this.main.request.delete<null>(`/wiki_pages/${id}.json`);
	}

	/**
	 * Revert a wiki page to a previous version
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the wiki page to revert
	 * @param {number} versionID - the version id to revert to (see history)
	 */
	async revert(id: number, versionID: number) {
		this.main.request.authCheck.call(this, "WikiPages#revert");
		const qs = new FormHelper()
			.add("version_id", versionID);
		return this.main.request.put<null>(`/wiki_pages/${id}/revert.json`, qs.build());
	}

	/**
	 * Get a specific wiki page history
	 *
	 * @param {number} id - the id of the history to get
	 * @returns {Promise<WikiPageHistory | null>}
	 */
	async getHistory(id: number) { return this.searchHistory({ id }).then(r => r.length === 0 ? null : r[0]); }

	/**
	 * Search the wiki page history
	 *
	 * @param {object} [options]
	 * @param {number} [options.id] - get a specific wiki page history entry
	 * @param {number} [options.wikiPage] - narrow the results by the wiki page id
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<WikiPageHistory>>}
	 */
	async searchHistory(options?: SearchWikiPageHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.id         === "number")    qs.add("search[id]", options.id);
		if (typeof options.wiki_page  === "number")    qs.add("search[wiki_page_id]", options.wiki_page);
		if (typeof options.page       !== "undefined") qs.add("page", options.page);
		if (typeof options.limit      === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<WikiPageHistoryProperties> | { wiki_page_versions: []; }>(`/wiki_page_versions.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "wiki_page_versions" in res) return [];
		return res!.map(info => new WikiPageHistory(this.main, info));
	}
}
