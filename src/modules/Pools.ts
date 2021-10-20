import type E621 from "..";
import Pool from "../structures/Pool";
import PoolHistory from "../structures/PoolHistory";
import type {
	PoolProperties,
	SearchPoolsOptions,
	CreatePoolOptions,
	ModifyPoolOptions,
	PoolOrder,
	PoolCategory,
	SearchPoolHistoryOptions,
	PoolHistoryProperties
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";

export default class Pools {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Pools) {
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
	 * Get a pool by its id
	 *
	 * @param {number} id - The id of the pool to get
	 * @returns {Promise<(Pool | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<PoolProperties>(`/pools/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new Pool(this.main, res);
	}


	/**
	 * Get a pool by its name
	 *
	 * @param {string} name - The name of the pool to get
	 * @returns {Promise<(Pool | null)>}
	 */
	async getByName(name: string) {
		return this.search({
			name,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Search for pools
	 *
	 * @param {object} [options]
	 * @param {string} [options.name] - narrow the results by the name of the pool
	 * @param {string} [options.description] - narrow the results by the description of the pool
	 * @param {string} [options.creator] - narrow the results by the (name of the) creator of the pool
	 * @param {Pool} [options.active] - narrow the results by the pool being active or not
	 * @param {PoolCategory} [options.category] - narrow the results by the category of the pool
	 * @param {PoolOrder} [options.order] - the order of the results
	 * @param {number} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Pool>>}
	 */
	async search(options?: SearchPoolsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.name        === "string")  qs.add("search[name_matches]", options.name);
		if (typeof options.description === "string")  qs.add("search[description_matches]", options.description);
		if (typeof options.creator     === "string")  qs.add("search[creator_name]", options.creator);
		if (typeof options.active      === "boolean") qs.add("search[is_active]", options.active);
		if (typeof options.category    === "string")  qs.add("search[category]", options.category);
		if (typeof options.order       === "string")  qs.add("search[order]", options.order);
		if (typeof options.page        === "number")  qs.add("page", options.page);
		if (typeof options.limit       === "number")  qs.add("limit", options.limit);
		const res = await this.main.request.get<{ post_sets: Array<PoolProperties>; }>(`/pools.json?${qs.build()}`);
		return res!.post_sets.map(info => new Pool(this.main, info));
	}

	/**
	 * Create a pool
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} options.name - the name of the set
	 * @param {string} [options.description] - the description of the pool
	 * @param {Array<number>} [options.posts] - the posts to add to the pool
	 * @param {PoolCategory} options.category - the category of the pool
	 * @param {boolean} [options.active] - if the pool is active
	 * @returns {Promise<Pool>}
	 */
	async create(options: CreatePoolOptions) {
		this.main.request.authCheck.call(this, "Pools#create");
		if (!options) throw new Error("options is required in Pools#create");
		const qs = new FormHelper()
			.add("pool[name]", options.name)
			.add("pool[category]", options.category);
		if (typeof options.description === "string")  qs.add("pool[description]", options.description);
		if (typeof options.active      === "boolean") qs.add("pool[is_active]", options.active);
		if (Array.isArray(options.posts) && options.posts.length > 0)  qs.add("pool[post_ids_string]", options.posts.join(" "));
		const res = await this.main.request.post<PoolProperties>("/pools.json", qs.build());
		return new Pool(this.main, res!);
	}

	/**
	 * modify a pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the pool to edit
	 * @param {object} options
	 * @param {string} [options.name] - the name of the pool
	 * @param {string} [options.description] - the description of the pool
	 * @param {Array<number>} [options.posts] - the posts to include in the pool (this will override all currently included posts)
	 * @param {boolean} [options.category] - the category of the pool
	 * @param {boolean} [options.active] - if the pool is active
	 * @returns {Promise<Pool>}
	 */
	async modify(id: number, options: ModifyPoolOptions) {
		this.main.request.authCheck.call(this, "Pools#modify");
		if (!options) throw new Error("options is required in Pools#modify");
		const qs = new FormHelper();
		if (typeof options.name        === "string")  qs.add("pool[name]", options.name);
		if (typeof options.description === "string")  qs.add("pool[description]", options.description);
		if (typeof options.category    === "string")  qs.add("pool[category]", options.category);
		if (typeof options.active      === "boolean") qs.add("pool[is_active]", options.active);
		if (Array.isArray(options.posts) && options.posts.length > 0)  qs.add("pool[post_ids]", options.posts.join(" "));
		const res = await this.main.request.put<PoolProperties>(`/pools/${id}.json`, qs.build());
		return new Pool(this.main, res!);
	}

	/**
	 * Delete a pool
	 *
	 * * Requires Authentication
	 *
	 * * Requires Janitor
	 *
	 * @param {number} id - the id of the pool to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "Pools#delete");
		return this.main.request.delete<null>(`/pools/${id}.json`);
	}

	/**
	 * Revert a pool to a previous version
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the pool to revert
	 * @param {number} versionID - the version id to revert to (see history)
	 */
	async revert(id: number, versionID: number) {
		this.main.request.authCheck.call(this, "Pools#revert");
		const qs = new FormHelper()
			.add("version_id", versionID);
		return this.main.request.put<null>(`/pools/${id}/revert.json`, qs.build());
	}

	/**
	 * Search the pool history
	 *
	 * @param {object} [options]
	 * @param {number} [options.pool] - narrow the results by the pool id
	 * @param {number} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<PoolHistory>>}
	 */
	async searchHistory(options?: SearchPoolHistoryOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.pool  === "number") qs.add("search[pool_id]", options.pool);
		if (typeof options.page  === "number") qs.add("page", options.page);
		if (typeof options.limit === "number") qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<PoolHistoryProperties>>(`/pool_versions.json?${qs.build()}`);
		return res!.map(info => new PoolHistory(this.main, info));
	}

	/**
	 * Add a post to a pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the pool to add to
	 * @param {(Array<number> | number)} posts - the post id (or multiple) to add to the pool
	 * @returns {Promise<Pool>}
	 */
	async addPost(id: number, posts: Array<number> | number) {
		this.main.request.authCheck.call(this, "Pools#addPost");
		const old = await this.get(id);
		if (old === null) throw new Error("invalid pool id given to Pools#addPost");
		if (!Array.isArray(posts)) posts = [posts];
		return this.modify(id, {
			posts: [...old.post_ids, ...posts]
		});
	}
	get addPosts() { return this.addPost.bind(this); }

	/**
	 * Remove a post from a pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the pool to remove from
	 * @param {(Array<number> | number)} posts - the post id (or multiple) to remove from the pool
	 * @returns {Promise<Pool>}
	 */
	async removePost(id: number, posts: Array<number> | number) {
		this.main.request.authCheck.call(this, "Pools#removePost");
		const old = await this.get(id);
		if (old === null) throw new Error("invalid pool id given to Pools#addPost");
		if (!Array.isArray(posts)) posts = [posts];
		return this.modify(id, {
			posts: old.post_ids.filter(p => !(posts as Array<number>).includes(p))
		});
	}
	get removePosts() { return this.removePost.bind(this); }
}
