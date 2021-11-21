import type User from "./User";
import type Pool from "./Pool";
import type { PoolCategory, PoolHistoryProperties } from "../types";
import type E621 from "..";

export default class PoolHistory implements PoolHistoryProperties {
	private main: E621;
	id: number;
	pool_id: number;
	post_ids: Array<number>;
	added_post_ids: Array<number>;
	removed_post_ids: Array<number>;
	updater_id: number;
	description: string;
	description_changed: boolean;
	name: string;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	is_deleted: boolean;
	category: PoolCategory;
	version: number;
	constructor(main: E621, info: PoolHistoryProperties) {
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
	 * Get the pool object for this history
	 *
	 * @returns {Promise<Pool | null>}
	 */
	async getPool() { return this.main.pools.get.call(this.main.pools, this.pool_id); }


	/**
	 * Revert the pool to this version
	 *
	 * * Requires Authentication
	 *
	 */
	async revertTo() {
		this.main.request.authCheck("PoolHistory#revertTo");
		return this.main.pools.revert.call(this.main.pools, this.pool_id, this.id);
	}
}
