import type E621 from "..";
import type {
	TakedownProperties,
	SearchTakedownsOptions,
	CreateTakedownOptions,
	ModifyTakedownOptions,
	TakedownStatus,
	SearchTakedownsOrder
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";
import Takedown from "../structures/Takedown";

export default class Takedowns {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Takedowns) {
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
	 * Get a takedown by its id
	 *
	 * @param {number} id - The id of the note to get
	 * @returns {Promise<(Takedown | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<TakedownProperties>(`/takedowns/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Takedown(this.main, res);
	}

	/**
	 * Search for takedowns
	 *
	 * @param {object} [options]
	 * @param {TakedownStatus} [options.status] - narrow the results by status
	 * @param {string} [options.source] - narrow the results by source (requires admin)
	 * @param {string} [options.reason] - narrow the results by reason (requires admin)
	 * @param {string} [options.admin_response] - narrow the results by admin response (requires admin)
	 * @param {boolean} [options.reason_hidden] - narrow the results by if the reason is hidden (requires admin)
	 * @param {string} [options.instructions] - narrow the results by special instructions (requires admin)
	 * @param {number} [options.post_id] - narrow the results by post id (requires admin)
	 * @param {string} [options.email] - narrow the results by email (requires admin)
	 * @param {string} [options.ip_address] - narrow the results by ip address (requires admin)
	 * @param {string} [options.vericode] - narrow the results by verification code (requires admin)
	 * @param {SearchTakedownsOrder} [options.order] - the order of th returned results
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Takedown>>}
	 */
	async search(options?: SearchTakedownsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.status         === "string")    qs.add("search[status]", options.status);
		if (typeof options.source         === "string")    qs.add("search[source]", options.source);
		if (typeof options.reason         === "string")    qs.add("search[reason]", options.reason);
		if (typeof options.admin_response === "string")    qs.add("search[notes]", options.admin_response);
		if (typeof options.reason_hidden  === "boolean")   qs.add("search[reason_hidden]", options.reason_hidden);
		if (typeof options.instructions   === "string")    qs.add("search[instructions]", options.instructions);
		if (typeof options.post_id        === "number")    qs.add("search[post_id]", options.post_id);
		if (typeof options.email          === "string")    qs.add("search[email]", options.email);
		if (typeof options.ip_address     === "string")    qs.add("search[ip_addr]", options.ip_address);
		if (typeof options.vericode       === "string")    qs.add("search[vericode]", options.vericode);
		if (typeof options.order          === "string")    qs.add("search[order]", options.order);
		if (typeof options.page           !== "undefined") qs.add("page", options.page);
		if (typeof options.limit          === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<TakedownProperties>>(`/takedowns.json?${qs.build()}`);
		return res!.map(info => new Takedown(this.main, info));
	}

	/**
	 * Create a takedown
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} options.source - the source of the takedown
	 * @param {string} options.email - a valid email for the takedown
	 * @param {(number | Array<number> | string | Array<string>)} [options.post_ids] - post ids or full post urls the takedown concerns (this and instructions are mutally exclusive)
	 * @param {string} [options.instructions] - a set of special instructions (this and post_ids are mutally exclusive)
	 * @param {string} options.reason - the reason for the takedown
	 * @param {boolean} [options.reason_hidden=false] - the hide the reason of the takedown
	 * @returns {Promise<Takedown>}
	 */
	async create(options: CreateTakedownOptions) {
		this.main.request.authCheck.call(this, "Takedowns#create");
		if (!options) throw new Error("options is required in Takedowns#create");
		if (typeof options.post_ids !== "undefined" && typeof options.instructions !== "undefined") process.emitWarning("only one of options.post_ids, options.instructions should be provided to Takedowns#create. options.post_ids overrides options.instructions.");
		const qs = new FormHelper()
			.add("takedown[source]", options.source)
			.add("takedown[email]", options.email)
			.add("takedown[reason]", options.reason);
		if (typeof options.reason_hidden === "boolean") qs.add("takedown[reason_hidden]", options.reason_hidden);
		if (typeof options.post_ids !== "undefined") {
			if (typeof options.post_ids === "number" || typeof options.post_ids === "string") qs.add("takedown[post_ids]", options.post_ids);
			else if (Array.isArray(options.post_ids)) qs.add("takedown[post_ids]", options.post_ids.join(" "));
		}
		if (typeof options.instructions === "string") qs.add("takedown[instructions]", options.instructions);

		const res = await this.main.request.post<TakedownProperties>("/takedowns.json", qs.build());
		return new Takedown(this.main, res!);
	}

	/**
	 * modify a takedown
	 *
	 * * Requires Authentication
	 *
	 * * Requires Admin
	 *
	 * @param {number} id - the id of the takedown to edit
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
	async modify(id: number, options: ModifyTakedownOptions) {
		this.main.request.authCheck.call(this, "Takedowns#modify");
		if (!options) throw new Error("options is required in Takedowns#modify");
		const qs = new FormHelper();
		if (typeof options.process_takedown        === "boolean") qs.add("process_takedown", options.process_takedown);
		if (typeof options.delete_reason           === "string")  qs.add("delete_reason", options.delete_reason);
		if (typeof options.takedown_posts          !== "undefined") {
			Object.entries(options.takedown_posts).forEach(([post, val]) => qs.add(`takedown_posts[${post}]`, val));
		}
		if (typeof options.takedown_add_posts_tags === "string")  qs.add("takedown-add-posts-tags", options.takedown_add_posts_tags);
		if (Array.isArray(options.takedown_add_posts_tags) && options.takedown_add_posts_tags.length > 0)  qs.add("takedown-add-posts-tags", options.takedown_add_posts_tags.join(" "));
		if (typeof options.takedown_add_posts_ids  === "string")  qs.add("takedown-add-posts-ids", options.takedown_add_posts_ids);
		if (Array.isArray(options.takedown_add_posts_ids) && options.takedown_add_posts_ids.length > 0)  qs.add("takedown-add-posts-ids", options.takedown_add_posts_ids.join(" "));
		if (typeof options.status                  === "string")  qs.add("takedown[status]", options.status);
		if (typeof options.notes                   === "string")  qs.add("takedown[notes]", options.notes);
		if (typeof options.reason_hidden           === "string")  qs.add("takedown[reason_hidden]", options.reason_hidden);
		const res = await this.main.request.put<TakedownProperties>(`/notes/${id}.json`, qs.build());
		return new Takedown(this.main, res!);
	}

	/**
	 * Delete a takedown
	 *
	 * * Requires Authentication
	 *
	 * * Requires Admin
	 *
	 * @param {number} id - the id of the takedownto delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "Takedowns#delete");
		return this.main.request.delete<null>(`/takedowns/${id}.json`);
	}
}
