import type E621 from "..";
import Artist from "../structures/Artist";
import type {
	ArtistProperties,
	SearchArtistsOptions,
	CreateArtistOptions,
	ModifyArtistOptions,
	SearchArtistsOrder,
	SearchArtistHistoryOptions,
	ArtistHistoryProperties,
	DoNotPostList
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";
import ArtistHistory from "../structures/ArtistHistory";

export default class Artists {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Artists) {
					return !this.main.options.authUser || !this.main.options.authKey ? null : `Basic ${Buffer.from(`${this.main.options.authUser}:${this.main.options.authKey}`).toString("base64")}`;
				},
				configurable: false,
				enumerable: false
			},
			main: {
				value: main,
				configurable: false,
				enumerable: false,
				writable: false
			}
		});
	}

	/**
	 * Get an artist by their id
	 *
	 * @param {number} id - The id of the artist to get
	 * @returns {Promise<(Artist | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<ArtistProperties>(`/artists/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Artist(this.main, res);
	}


	/**
	 * Get an artist by their name
	 *
	 * @param {string} name - The name of the artist to get
	 * @returns {Promise<(Artist | null)>}
	 */
	async getByName(name: string) {
		return this.search({
			name,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Search for artists
	 *
	 * @param {object} [options]
	 * @param {string} [options.name] - narrow the results by the name of the artist
	 * @param {string} [options.url] - narrow the results by urls of the artist
	 * @param {string} [options.creator] - narrow the results by the (name of the) creator of the artist page
	 * @param {boolean} [options.active] - narrow the results by the artist being active
	 * @param {boolean} [options.banned] - narrow the results by the artist being banned
	 * @param {boolean} [options.has_tag] - narrow the results by the artist having a matching tag
	 * @param {SearchArtistsOrder} [options.order] - the order of the results
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<ArtistProperties>>}
	 */
	async search(options?: SearchArtistsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.name    === "string")    qs.add("search[any_name_matches]", options.name);
		if (typeof options.url     === "string")    qs.add("search[url_matches]", options.url);
		if (typeof options.creator === "string")    qs.add("search[creator_name]", options.creator);
		if (typeof options.active  === "boolean")   qs.add("search[is_active]", options.active);
		if (typeof options.banned  === "boolean")   qs.add("search[is_banned]", options.banned);
		if (typeof options.has_tag === "boolean")   qs.add("search[has_tag]", options.has_tag);
		if (typeof options.order   === "string")    qs.add("search[order]", options.order);
		if (typeof options.page    !== "undefined") qs.add("page", options.page);
		if (typeof options.limit   === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<ArtistProperties>>(`/artists.json?${qs.build()}`);
		return res!.map(info => new Artist(this.main, info));
	}

	/**
	 * Create an artist
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} options.name - the name of artist
	 * @param {number} [options.linked_user_id] - the id of the user associated with this artist (requires janitor)
	 * @param {boolean} [options.locked] - if the artist should be locked (requires janitor)
	 * @param {(Array<string> | string)} [options.other_names] - the other names for this artist
	 * @param {string} [options.group_name] - the group name of this artist (this is [planned to be removed](https://github.com/zwagoth/e621ng/pull/357))
	 * @param {(Array<string> | string)} [options.urls] - the urls associated with this artist
	 * @param {string} [options.notes] - notes for this artist
	 * @returns {Promise<Artist>}
	 */
	async create(options: CreateArtistOptions) {
		this.main.request.authCheck.call(this, "Artists#create");
		if (!options) throw new Error("options is required in Artists#create");
		const qs = new FormHelper()
			.add("artist[name]", options.name);
		if (typeof options.linked_user_id === "number")  qs.add("artist[linked_user_id]", options.linked_user_id);
		if (typeof options.locked         === "boolean") qs.add("artist[is_locked]", options.locked);
		if (typeof options.other_names    === "string")  qs.add("artist[other_names_string]", options.other_names);
		if (Array.isArray(options.other_names))          qs.add("artist[other_names_string]", options.other_names.join(" "));
		if (typeof options.group_name     === "string")  qs.add("artist[group_name]", options.group_name);
		if (typeof options.urls           === "string")  qs.add("artist[url_string]", options.urls);
		if (Array.isArray(options.urls))                 qs.add("artist[url_string]", options.urls.join("\n"));
		if (typeof options.notes          === "string")  qs.add("artist[notes]", options.notes);
		const res = await this.main.request.post<ArtistProperties>("/artists.json", qs.build());
		return new Artist(this.main, res!);
	}

	/**
	 * modify an artist
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id  of the artists to edit
	 * @param {object} options
	 * @param {string} [options.name] - the name of artist (requires janitor)
	 * @param {number} [options.linked_user_id] - the id of the user associated with this artist (requires janitor)
	 * @param {boolean} [options.locked] - if the artist should be locked (requires janitor)
	 * @param {(Array<string> | string)} [options.other_names] - the other names for this artist
	 * @param {string} [options.group_name] - the group name of this artist (this is [planned to be removed](https://github.com/zwagoth/e621ng/pull/357))
	 * @param {(Array<string> | string)} [options.urls] - the urls associated with this artist
	 * @param {string} [options.notes] - notes for this artist
	 * @returns {Promise<Artist>}
	 */
	async modify(id: number, options: ModifyArtistOptions) {
		this.main.request.authCheck.call(this, "Artists#modify");
		if (!options) throw new Error("options is required in Artists#modify");
		const qs = new FormHelper();
		if (typeof options.name         === "string")  qs.add("artist[name]", options.name);
		if (typeof options.linked_user_id === "number")  qs.add("artist[linked_user_id]", options.linked_user_id);
		if (typeof options.locked       === "boolean") qs.add("artist[is_locked]", options.locked);
		if (typeof options.other_names   === "string")  qs.add("artist[other_names_string]", options.other_names);
		if (Array.isArray(options.other_names))         qs.add("artist[other_names_string]", options.other_names.join(" "));
		if (typeof options.group_name    === "string")  qs.add("artist[group_name]", options.group_name);
		if (typeof options.urls         === "string")  qs.add("artist[url_string]", options.urls);
		if (Array.isArray(options.urls))               qs.add("artist[url_string]", options.urls.join("\n"));
		if (typeof options.notes        === "string")  qs.add("artist[notes]", options.notes);
		const res = await this.main.request.patch<ArtistProperties>(`/artists/${id}.json`, qs.build());
		return new Artist(this.main, res!);
	}

	/**
	 * Delete an artist
	 *
	 * * Requires Authentication
	 *
	 * * Requires Janitor
	 *
	 * @param {number} id - the id of the artist to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "Artists#delete");
		return this.main.request.delete<null>(`/artists/${id}.json`);
	}

	/**
	 * Revert an artist to a previous version
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the artist to revert
	 * @param {number} versionID - the version id to revert to (see history)
	 */
	async revert(id: number, versionID: number) {
		this.main.request.authCheck.call(this, "Artists#revert");
		const qs = new FormHelper()
			.add("version_id", versionID);
		return this.main.request.put<null>(`/artists/${id}/revert.json`, qs.build());
	}

	/**
	 * Get a specific artist history
	 *
	 * @param {number} id - the id of the history to get
	 * @returns {Promise<ArtistHistory | null>}
	 */
	async getHistory(id: number) { return this.searchHistory({ id }).then(r => r.length === 0 ? null : r[0]); }

	/**
	 * Search the artist history
	 *
	 * * Requires Authentication
	 *
	 * @param {object} [options]
	 * @param {number} [options.id] - get a specific artist history entry
	 * @param {string} [options.artist] - narrow the results by artist name
	 * @param {number} [options.artist_id] - narrow the results by artist id
	 * @param {number} [options.updater_id] - narrow the results by updater id
	 * @param {string} [options.updater] - narrow the results by updater name
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<ArtistHistory>>}
	 */
	async searchHistory(options?: SearchArtistHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.id          === "number")    qs.add("search[id]", options.id);
		if (typeof options.artist  === "number")    qs.add("search[name]", options.artist);
		if (typeof options.artist_id    === "number")    qs.add("search[artist_id]", options.artist_id);
		if (typeof options.updater === "number")    qs.add("search[updater]", options.updater);
		if (typeof options.updater_id   === "number")    qs.add("search[updater_id]", options.updater_id);
		if (typeof options.page        !== "undefined") qs.add("page", options.page);
		if (typeof options.limit       === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<ArtistHistoryProperties> | { artist_versions: []; }>(`/artist_versions.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "artist_versions" in res) return [];
		return res!.map(info => new ArtistHistory(this.main, info));
	}

	/**
	 * Get the list of do not post & conditional do not post artists.
	 *
	 * This assumes whatever instance you're running against has the same structure as e621!
	 *
	 * @param {number} [id=85] - the id of the dnp wiki page (85 on e621)
	 * @returns {Promise<DoNotPostList>}
	 */
	async getDoNotPost(id = 85) {
		const res = await this.main.wikiPages.get.call(this.main.wikiPages, id);
		if (res === null) throw new Error("failed to get dnp wiki page");
		const body = res.body.split("\n");
		const dnpStart = body.findIndex(line => line.includes("[#number]#"));
		const dnpEnd = body.findIndex(line => line.startsWith("h4") && line.includes("Conditional Do Not Post"));
		const condStart = dnpEnd;
		const condEnd = body.findIndex(line => line.includes("DNP List, Do-Not-Post List"));
		const dnp: Array<string> = [], cond: Array<string> = [];
		for (let i = dnpStart; i < dnpEnd; i++) {
			const line = body[i];
			if (!line || !line.startsWith("*")) continue;
			const names = line.slice(2).split("-")[0];
			if (names.includes("/")) dnp.push(...names.split("/").map(n => n.split(" on ")[0].trim()));
			else dnp.push(names.split(" on ")[0].trim());
		}

		for (let i = condStart; i < condEnd; i++) {
			const line = body[i];
			if (!line || !line.startsWith("*")) continue;
			const names = line.slice(2).split("-")[0].replace(/\[\/?b\]/g, "");
			if (names.includes("/")) cond.push(...names.split("/").map(n => n.split(" on ")[0].trim()));
			else cond.push(names.split(" on ")[0].trim());
		}

		return {
			dnp: Array.from(new Set(dnp)),
			conditionalDNP: Array.from(new Set(cond))
		};
	}
}
