import type E621 from "..";
import type {
	BlipProperties,
	SearchBlipsOptions,
	CreateBlipOptions,
	SearchBlipsOrder,
	ModifyBlipOptions,
	BlipWarningType
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";
import Blip from "../structures/Blip";

export default class Blips {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Blips) {
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
	 * Get a blip by its id
	 *
	 * @param {number} id - The id of the blip to get
	 * @returns {Promise<(Blip | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<BlipProperties>(`/blips/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Blip(this.main, res);
	}

	/**
	 * Search for blips
	 *
	 * @param {object} [options]
	 * @param {string} [options.creator] - narrow the results by creator name
	 * @param {number} [options.creator_id] - narrow the results by creator id
	 * @param {string} [options.body] - narrow the results by body content
	 * @param {number} [options.response_to] - narrow the results by parent id
	 * @param {string} [options.ip_address] - narrow the results by ip address (requires moderator)
	 * @param {SearchBlipsOrder} [options.order] - the order of the results
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Blip>>}
	 */
	async search(options?: SearchBlipsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.creator     === "string")    qs.add("search[creator_name]", options.creator);
		if (typeof options.creator_id  === "string")    qs.add("search[creator_id]", options.creator_id);
		if (typeof options.body        === "boolean")   qs.add("search[body_matches]", options.body);
		if (typeof options.response_to === "number")    qs.add("search[response_to]", options.response_to);
		if (typeof options.ip_address  === "string")    qs.add("search[ip_addr]", options.ip_address);
		if (typeof options.order       === "string")    qs.add("search[order]", options.order);
		if (typeof options.page        !== "undefined") qs.add("page", options.page);
		if (typeof options.limit       === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<BlipProperties>>(`/blips.json?${qs.build()}`);
		return res!.map(info => new Blip(this.main, info));
	}

	/**
	 * Create a blip
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} options.body - the body content of the blip
	 * @param {number} [options.response_to] - the blip to respond to
	 * @returns {Promise<Blip>}
	 */
	async create(options: CreateBlipOptions) {
		this.main.request.authCheck.call(this, "PostFlag#create");
		if (!options) throw new Error("options is required in Blips#create");
		const qs = new FormHelper()
			.add("blip[body]", options.body);
		if (typeof options.response_to === "number") qs.add("blip[response_to]", options.response_to);
		const res = await this.main.request.post<BlipProperties>("/blips.json", qs.build());
		return new Blip(this.main, res!);
	}

	/**
	 * modify a blip
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator if not created by self
	 *
	 * * blips older than 5 minutes cannot be edited (does not apply if moderator)
	 *
	 * @param {number} id - the id of the blip to edit
	 * @param {object} options
	 * @param {string} options.body - the body content of the blip
	 * @returns {Promise<Blip>}
	 */
	async modify(id: number, options: ModifyBlipOptions) {
		this.main.request.authCheck.call(this, "Blips#modify");
		if (!options) throw new Error("options is required in Blips#modify");
		const qs = new FormHelper()
			.add("blip[body]", options.body);
		const res = await this.main.request.patch<BlipProperties>(`/blips/${id}.json`, qs.build());
		return new Blip(this.main, res!);
	}

	/**
	 * Delete a blip
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {number} post_id - the id of blip to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "Blips#delete");
		return this.main.request.delete<null>(`/blips/${id}.json`);
	}

	/**
	 * Add a warning to a blip
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {number} id - the id of the blip to add the warning to
	 * @param {BlipWarningType} type - the type of warning to
	 * @returns {Promise<Blip>}
	 */
	async addWarning(id: number, type: BlipWarningType) {
		this.main.request.authCheck.call(this, "Blips#addWarning");
		const qs = new FormHelper()
			.add("blip[record_type]", type);
		const res = await this.main.request.post<BlipProperties>(`/blips/${id}/warning.json`, qs.build());
		return new Blip(this.main, res!);
	}
}
