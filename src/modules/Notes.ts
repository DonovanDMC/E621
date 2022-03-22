import type E621 from "..";
import type {
	NoteProperties,
	SearchNotesOptions,
	CreateNoteOptions,
	ModifyNoteOptions,
	SearchNoteHistoryOptions,
	NoteHistoryProperties
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";
import Note from "../structures/Note";
import NoteHistory from "../structures/NoteHistory";

export default class Notes {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Notes) {
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
	 * Get a note by its id
	 *
	 * @param {number} id - The id of the note to get
	 * @returns {Promise<(Note | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<NoteProperties>(`/notes/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Note(this.main, res);
	}

	/**
	 * Search for notes
	 *
	 * @param {object} [options]
	 * @param {string} [options.body] - narrow the results by the body of the note
	 * @param {string} [options.author] - narrow the results by the (name of the) creator of the note
	 * @param {(string | Array<string>)} [options.tags] - narrow the results by the tags of the post the note is on
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Note>>}
	 */
	async search(options?: SearchNotesOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.body   === "string") qs.add("search[body_matches]", options.body);
		if (typeof options.author === "string") qs.add("search[creator_name]", options.author);
		if (typeof options.tags   === "string") qs.add("search[post_tags_match]", options.tags);
		if (Array.isArray(options.tags) && options.tags.length > 0) qs.add("search[post_tags_match]", options.tags.join(" "));
		if (typeof options.page   !== "undefined") qs.add("page", options.page);
		if (typeof options.limit  === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<NoteProperties>>(`/notes.json?${qs.build()}`);
		return res!.map(info => new Note(this.main, info));
	}

	/**
	 * Create a note
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {number} options.post_id - the id of the post to make the note on
	 * @param {number} options.x - the x location of the note
	 * @param {number} options.y - the y location of the note
	 * @param {number} options.width - the width of the note
	 * @param {number} options.height - the height of the note
	 * @param {string} options.body - the body of the note
	 * @returns {Promise<Note>}
	 */
	async create(options: CreateNoteOptions) {
		this.main.request.authCheck.call(this, "Notes#create");
		if (!options) throw new Error("options is required in Notes#create");
		const qs = new FormHelper()
			.add("note[post_id]", options.post_id)
			.add("note[x]", options.x)
			.add("note[y]", options.y)
			.add("note[width]", options.width)
			.add("note[height]", options.height)
			.add("note[body]", options.body);
		const res = await this.main.request.post<NoteProperties>("/notes.json", qs.build());
		if (res && !Array.isArray(res) && "notes" in res) return [];
		return new Note(this.main, res!);
	}

	/**
	 * modify a note
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the note to edit
	 * @param {object} options
	 * @param {number} [options.x] - the x location of the note
	 * @param {number} [options.y] - the y location of the note
	 * @param {number} [options.width] - the width of the note
	 * @param {number} [options.height] - the height of the note
	 * @param {string} [options.body] - the body of the note
	 * @returns {Promise<Note>}
	 */
	async modify(id: number, options: ModifyNoteOptions) {
		this.main.request.authCheck.call(this, "Notes#modify");
		if (!options) throw new Error("options is required in Notes#modify");
		const qs = new FormHelper();
		if (typeof options.x          === "number")  qs.add("note[x]", options.x);
		if (typeof options.y           === "number")  qs.add("note[y]", options.y);
		if (typeof options.width         === "number") qs.add("note[width]", options.width);
		if (typeof options.height === "number") qs.add("note[height]", options.height);
		if (typeof options.body         === "string")  qs.add("note[body]", options.body);
		const res = await this.main.request.put<NoteProperties>(`/notes/${id}.json`, qs.build());
		return new Note(this.main, res!);
	}

	/**
	 * Delete a note
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the note to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "Notes#delete");
		return this.main.request.delete<null>(`/notes/${id}.json`);
	}

	/**
	 * Get a specific notes history
	 *
	 * @param {number} id - the id of the history to get
	 * @returns {Promise<NoteHistory | null>}
	 */
	async getHistory(id: number) { return this.searchHistory({ id }).then(r => r.length === 0 ? null : r[0]); }

	/**
	 * Search the notes history
	 *
	 * @param {object} [options]
	 * @param {number} [options.id] - get a specific notes history entry
	 * @param {number} [options.note_id] - narrow the results by the note id
	 * @param {number} [options.post_id] - narrow the results by the id of the post the note is on
	 * @param {string} [options.body] - narrow the results by the content
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<NoteHistory>>}
	 */
	async searchHistory(options?: SearchNoteHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.id     === "number")    qs.add("search[id]", options.id);
		if (typeof options.note_id === "number")    qs.add("search[note_id]", options.note_id);
		if (typeof options.post_id === "number")    qs.add("search[post_id]", options.post_id);
		if (typeof options.body   === "string")    qs.add("search[body_matches]", options.body);
		if (typeof options.page   !== "undefined") qs.add("page", options.page);
		if (typeof options.limit  === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<NoteHistoryProperties> | { note_versions: []; }>(`/note_versions.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "note_versions" in res) return [];
		return res!.map(info => new NoteHistory(this.main, info));
	}
}
