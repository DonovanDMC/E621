import type { GenericSearchOptions } from ".";

export type PoolCategory = "collection" | "series";
export interface PoolProperties {
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
	creator_id: number;
	creator_name: string;
	is_active: boolean;
	is_deleted: boolean;
	category: PoolCategory;
	post_ids: Array<number>;
	post_count: number;
}

export type SearchPoolsOrder = "updated_at" | "name" | "created_at" | "post_count";
export interface SearchPoolsOptions extends GenericSearchOptions {
	name?: string;
	description?: string;
	creator?: string;
	active?: boolean;
	category?: PoolCategory;
	order?: SearchPoolsOrder;
}

// the api docs list is_locked, but it isn't a permitted parameter, and I can't find any references in the source code
// so it seems like it was removed and the docs are just out of date
export interface CreatePoolOptions {
	name: string;
	description?: string;
	posts?: Array<number>;
	category: PoolCategory;
	active?: boolean;
}

export type ModifyPoolOptions = Partial<CreatePoolOptions>;

export interface PoolHistoryProperties {
	id: number;
	pool_id: number;
	post_ids: Array<number>;
	added_post_ids: Array<number>;
	removed_post_ids: Array<number>;
	updater_id: number;
	description: string | null;
	description_changed: boolean;
	name: string | null;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	is_deleted: boolean;
	is_locked: boolean;
	category: PoolCategory | null;
	version: number;
}

export interface SearchPoolHistoryOptions extends GenericSearchOptions {
	id?: number;
	pool?: number;
}
