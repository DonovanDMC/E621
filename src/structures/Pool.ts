import type Post from "./Post";
import type PoolHistory from "./PoolHistory";
import type { PoolProperties, PoolCategory, ModifyPoolOptions, SearchPoolHistoryOptions } from "../types";
import type E621 from "..";

export default class Pool implements PoolProperties {
	private main: E621;
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
	creator_id: number;
	creator_name: string;
	is_active: boolean;
	category: PoolCategory;
	is_deleted: boolean;
	post_ids: Array<number>;
	post_count: number;
	constructor(main: E621, info: PoolProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the post objects for the posts in this set
	 *
	 * @returns {Promise<Array<Post>>}
	 */
	async getPosts() { return this.main.posts.search({ tags: this.post_ids.map(p => `id:${p}`) }); }

	/**
	 * Add a post to this pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to add
	 * @returns {Promise<Pool>}
	 */
	async addPost(id: number) {
		this.main.request.authCheck("Pool#addPost");
		return this.main.postSets.addPost(this.id, id);
	}

	/**
	 * Remove a post from this pool
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to remove
	 * @returns {Promise<Pool>}
	 */
	async removePost(id: number) {
		this.main.request.authCheck("Pool#removePost");
		return this.main.postSets.removePost(this.id, id);
	}

	/**
	 * modify this pool
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} [options.name] - the name of the pool
	 * @param {string} [options.description] - the description of the pool
	 * @param {Array<number>} [options.posts] - the posts to include in the pool (this will override all currently included posts)
	 * @param {boolean} [options.category] - the category of the pool
	 * @param {boolean} [options.active] - if the pool is active
	 * @returns {Promise<Pool>}
	 */
	async modify(options: ModifyPoolOptions) {
		this.main.request.authCheck("Pool#modify");
		return this.main.pools.modify(this.id, options);
	}

	/**
	 * Delete this pool
	 *
	 * * Requires Authentication
	 *
	 * * Requires Janitor
	 *
	 * @returns {Promise<null>}
	 */
	async delete() {
		this.main.request.authCheck("Pool#delete");
		return this.main.pools.delete(this.id);
	}

	/**
	 * Revert this pool to a previous version
	 *
	 * * Requires Authentication
	 *
	 * @param {number} versionID - the version id to revert to (see history)
	 */
	async revert(versionID: number) {
		this.main.request.authCheck("Pool#revert");
		return this.main.pools.revert(this.id, versionID);
	}

	/**
	 * Search this pool's history
	 *
	 * @param {object} [options]
	 * @param {number} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<PoolHistory>>}
	 */
	async getHistory(options?: Omit<SearchPoolHistoryOptions, "pool">) {
		return this.main.pools.searchHistory({ pool: this.id, ...options });
	}
}
