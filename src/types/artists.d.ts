import type { GenericSearchOptions } from ".";

export interface ArtistProperties {
	id: number;
	name: string;
	updated_at: string;
	is_active: boolean;
	other_names: Array<string>;
	group_name: string;
	linked_user_id: number | null;
	created_at: string;
	is_banned: boolean;
	creator_id: number;
	is_locked: boolean;
	notes: string | null;
	domains: Array<string>;
	urls: Array<ArtistURL>;
}

export interface ArtistURL {
	id: number;
	artist_id:  number;
	url: string;
	normalized_url: string;
	created_at: string;
	updated_at: string;
	is_active: boolean;
}

export type SearchArtistsOrder = "created_at" | "updated_at" | "name" | "post_count";
export interface SearchArtistsOptions extends GenericSearchOptions {
	name?: string;
	url?: string;
	creator?: string;
	active?: boolean;
	banned?: boolean;
	has_tag?: boolean;
	order?: SearchArtistsOrder;
}

export interface CreateArtistOptions {
	name: string;
	/** requires janitor */
	linked_user_id?: number;
	/** requires janitor */
	locked?: boolean;
	other_names?: Array<string> | string;
	/** This is [planned to be removed](https://github.com/zwagoth/e621ng/pull/357) */
	group_name?: string;
	urls?: Array<string> | string;
	notes?: string;
}

export type ModifyArtistOptions = CreateArtistOptions; // no differences

export interface ArtistHistoryProperties {
	id: number;
	artist_id: number;
	name: string;
	updater_id: number;
	is_active: boolean;
	group_name: string;
	is_banned: boolean;
	notes_changed: boolean;
	created_at: string;
	updated_at: string;
	other_names: Array<string>;
	urls: Array<string>;
}

export interface SearchArtistHistoryOptions extends GenericSearchOptions {
	id?: number;
	artist?: string;
	artist_id?: number;
	updater?: string;
	updater_id?: number;
}

interface DoNotPostList {
	dnp: Array<string>;
	conditional_dnp: Array<string>;
}
