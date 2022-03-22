import type { GenericSearchOptions } from ".";

export interface PostSetProperties {
	id: number;
	name: string;
	shortname: string;
	description: string;
	is_public: boolean;
	transfer_on_delete: boolean;
	creator_id: number;
	post_ids: Array<number>;
	post_count: number;
	created_at: string;
	updated_at: string;
}

export type SearchPostSetsOrder = "name" | "shortname" | "postcount" | "created_at" | "update";
export interface SearchPostSetsOptions extends GenericSearchOptions {
	name?: string;
	shortname?: string;
	username?: string;
	order?: SearchPostSetsOrder;
}

export interface CreatePostSetOptions {
	name: string;
	shortname: string;
	description?: string;
	public?: boolean;
	transfer_on_deletion?: boolean;
}

export type ModifyPostSetOptions = Partial<CreatePostSetOptions>;
