import type { GenericSearchOptions } from ".";

type PostFlagCategory = "normal" | "unapproved" | "deleted" | "banned" | "duplicate";
export interface PostFlagProperties {
	id: number;
	created_at: string;
	updated_at: string;
	post_id: number;
	reason: string;
	creator_id: number;
	is_resolved: boolean;
	is_deletion: boolean;
	category: PostFlagCategory;
}

export interface SearchPostFlagsOptions extends GenericSearchOptions {
	reason?: string;
	tags?: string | Array<string>;
	post_id?: number;
	/** requires janitor if not self */
	creator?: string;
	/** requires janitor if not self */
	creator_id?: number;
	/** requires moderator */
	ip_address?: string;
	resolved?: boolean;
	category?: PostFlagCategory;
}

export type PostFlagReasons = "dnp_artist" | "pay_content" | "trace" | "previously_deleted" | "real_porn" | "corrupt" | "inferior" | "user";
export interface CreatePostFlagOptions {
	post_id: number;
	reason_name: PostFlagReasons;
	/** for previously_deleted & inferior */
	parent_id?: number;
}
