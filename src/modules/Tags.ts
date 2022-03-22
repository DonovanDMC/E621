import type E621 from "..";
import Tag from "../structures/Tag";
import TagHistory from "../structures/TagHistory";
import type {
	TagProperties,
	SearchTagsOptions,
	ModifyTagOptions,
	SearchTagsOrder,
	SearchTagHistoryOptions,
	TagHistoryProperties,
	AutocompleteResult
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";

export default class Tags {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Tags) {
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
	 * Get a tag by its id
	 *
	 * @param {number} id - The id of the tag to get
	 * @returns {Promise<(Tag | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<TagProperties>(`/tags/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Tag(this.main, res);
	}


	/**
	 * Get a tag by its name
	 *
	 * @param {string} name - The name of the tag to get
	 * @returns {Promise<(Tag | null)>}
	 */
	async getByName(name: string) {
		return this.search({
			name,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Search for tags
	 *
	 * @param {object} [options]
	 * @param {string} [options.name] - narrow the results by the name of the tag
	 * @param {number} [options.category] - narrow the results by the category of the tag
	 * @param {boolean} [options.hide_empty] - narrow the results by the tag being empty or not
	 * @param {boolean} [options.has_wiki] - narrow the results by the tag having a wiki or not
	 * @param {boolean} [options.has_artist] - narrow the results by the tag having an artist or not
	 * @param {SearchTagsOrder} [options.order] - the order of the results
	 * @param {number} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Tag>>}
	 */
	async search(options?: SearchTagsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.name       === "string")  qs.add("search[name_matches]", options.name);
		if (typeof options.category   === "string")  qs.add("search[category]", options.category);
		if (typeof options.hide_empty === "boolean") qs.add("search[hide_empty]", options.hide_empty);
		if (typeof options.has_wiki   === "string")  qs.add("search[has_wiki]", options.has_wiki);
		if (typeof options.has_artist === "string")  qs.add("search[has_artist]", options.has_artist);
		if (typeof options.order      === "string")  qs.add("search[order]", options.order);
		if (typeof options.page       === "number")  qs.add("page", options.page);
		if (typeof options.limit      === "number")  qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<TagProperties>>(`/tags.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "tags" in res) return [];
		return res!.map(info => new Tag(this.main, info));
	}

	/**
	 * modify a tag
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the tag to edit
	 * @param {object} options
	 * @param {number} [options.category] - the category of the tag
	 * @param {boolean} [options.locked] - if the tag is locked (requires moderator)
	 * @returns {Promise<Tag>}
	 */
	async modify(id: number, options: ModifyTagOptions) {
		this.main.request.authCheck.call(this, "Tags#modify");
		if (!options) throw new Error("options is required in Tags#modify");
		const qs = new FormHelper();
		if (typeof options.category === "string")  qs.add("tag[category]", options.category);
		if (typeof options.locked   === "boolean") qs.add("tag[is_locked]", options.locked);
		const res = await this.main.request.put<TagProperties>(`/tags/${id}.json`, qs.build());
		return new Tag(this.main, res!);
	}

	/**
	 * Get a specific tag type history
	 *
	 * @param {number} id - the id of the history to get
	 * @returns {Promise<TagHistory | null>}
	 */
	async getHistory(id: number) { return this.searchHistory({ id }).then(r => r.length === 0 ? null : r[0]); }

	/**
	 * Search the tag type history
	 *
	 * @param {object} [options]
	 * @param {number} [options.id] - get a specific tag type history entry
	 * @param {string} [options.tag] - narrow the results by the tag name
	 * @param {string} [options.user] - narrow the results by the editor name
	 * @param {number} [options.user_id] - narrow the results by the editor id
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<TagHistory>>}
	 */
	async searchHistory(options?: SearchTagHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.id        === "number")    qs.add("search[id]", options.id);
		if (typeof options.tag       === "string")    qs.add("search[tag]", options.tag);
		if (typeof options.user      === "string")    qs.add("search[user_name]", options.user);
		if (typeof options.user_id   === "number")    qs.add("search[user_id]", options.user_id);
		if (typeof options.page      !== "undefined") qs.add("page", options.page);
		if (typeof options.limit     === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<TagHistoryProperties> | { tag_type_versions: []; }>(`/tag_type_versions.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "tag_type_versions" in res) return [];
		return res!.map(info => new TagHistory(this.main, info));
	}

	/**
	 * Get autocomplete results
	 *
	 * @param {string} match - the string to get results for
	 * @returns {Promise<Array<AutocompleteResult>>}
	 */
	async getAutocomplete(match: string) {
		if (!match) throw new Error("string to match is required in Tags#getAutocomplete");
		const qs = new FormHelper().add("search[name_matches]", match);
		const res = await this.main.request.get<Array<AutocompleteResult>>(`/tags/autocomplete.json?${qs.build()}`);
		if (res && !Array.isArray(res)) return [];
		return res;
	}
}
