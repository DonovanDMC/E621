import type { GenericSearchOptions } from ".";

export interface TagProperties {
	id: number;
	name: string;
	created_at: string;
	updated_at: string;
	creator_id: number;
	post_count: number;
	category: number;
	related_tags: string | null;
	related_tags_updated_at: string | null;
	is_locked: boolean;
}

export type SearchTagsOrder = "date" | "count" | "name";
export interface SearchTagsOptions extends GenericSearchOptions {
	name?: string;
	category?: number;
	order?: SearchTagsOrder;
	hideEmpty?: boolean;
	hasWiki?: boolean;
	hasArtist?: boolean;
}

export interface ModifyTagOptions {
	category?: number;
	/** requires moderator */
	locked?: boolean;
}

export interface TagHistoryProperties {
	id: number;
	created_at: string;
	updated_at: string;
	old_type: number;
	new_type: number;
	is_locked: boolean;
	tag_id: number;
	creator_id: number;
}

export interface SearchTagHistoryOptions extends GenericSearchOptions {
	tag?: string;
	userName?: string;
	userID?: number;
}
