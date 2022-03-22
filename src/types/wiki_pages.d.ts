import type { GenericSearchOptions } from ".";

export interface WikiPageProperties {
	id: number;
	creator_id: number;
	creator_name: string;
	category_name: number;
	body: string;
	is_locked: boolean;
	created_at: string;
	updated_at: string;
	updater_id: number;
	other_names: Array<string>;
	is_deleted: boolean;
}

export type SearchWikiPagesOrder = "title" | "time" | "post_count";
export interface SearchWikiPagesOptions extends GenericSearchOptions {
	title?: string;
	creator?: string;
	body?: string;
	otherNames?: string;
	hasOtherNames?: boolean;
	hideDeleted?: boolean;
	order?: SearchWikiPagesOrder;
}

export interface CreateWikiPageOptions {
	title: string;
	body: string;
	/** requires janitor */
	locked?: boolean;
	/** requires janitor */
	forceOverwrite?: boolean;
	reason?: string;
}

export interface ModifyWikiPageOptions {
	/** requires janitor */
	title?: string;
	body?: string;
	/** requires janitor */
	locked?: boolean;
	/** requires janitor */
	forceOverwrite?: boolean;
	reason?: string;
}

export interface WikiPageHistoryProperties {
	id: number;
	wiki_page_id: number;
	updater_id: number | null; // through testing I've seen nulls
	title: string;
	body: string;
	is_locked: boolean;
	created_at: string;
	updated_at: string;
	other_names: Array<string>;
	is_deleted: boolean;
	reason: string;
}

export interface SearchWikiPageHistoryOptions extends GenericSearchOptions {
	id?: number;
	wiki_page?: number;
}
