import type { GenericSearchOptions } from ".";

export type Ratings = "s" | "q" | "e";
export interface PostProperties {
	id: number;
	created_at: string;
	updated_at: string;
	file: {
		width: number;
		height: number;
		ext: string;
		size: number;
		md5: string;
		url: string;
	};
	preview: {
		width: number;
		height: number;
		url: string;
	};
	sample: {
		has: boolean;
		height: number;
		width: number;
		url: string;
		// seems to be used for videos
		alternates: Record<string, {
			type: string;
			height: number;
			width: number;
			urls: Array<string | null>;
		}>;
	};
	score: Record<"up" | "down" | "total", number>;
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", Array<string>>;
	locked_tags: Array<string>;
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: Ratings;
	fav_count: number;
	sources: Array<string>;
	pools: Array<number>;
	relationships: {
		parent_id: number | null;
		has_children: boolean;
		has_active_children: boolean;
		children: Array<number>;
	};
	approver_id: number | null;
	uploader_id: number;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
}

export interface SearchPostsOptions extends GenericSearchOptions {
	tags?: string | Array<string>;
}

export type CreatePostOptions = {
	tags: Array<string> | string;
	rating: Ratings;
	/** required, even if empty */
	sources: Array<string> | string;
	description?: string;
	parent_id?: number;
	referer_url?: string;
	md5_confirmation?: string;
	/** requires approver */
	as_pending?: boolean;
	/** requires privileged */
	rating_locked?: boolean;
	/** requires admin */
	locked_tags?: Array<string> | string;
} & ({
	file: Buffer;
} | {
	file_url: string;
});

export interface NewPost {
	success: true;
	location: `/posts/${number}`;
	post_id: number;
}

export interface ModifyPostOptions {
	edit_reason?: string;
	add_tags?: Array<string> | string;
	remove_tags?: Array<string> | string;
	add_sources?: Array<string> | string;
	remove_sources?: Array<string> | string;
	rating?: Ratings;
	description?: string;
	parent_id?: number;
	has_embedded_notes?: boolean;
	/** requires privileged */
	rating_locked?: boolean;
	/** requires janitor */
	note_locked?: boolean;
	/** requires admin */
	status_locked?: boolean;
	/** requires admin */
	hide_from_anonymous?: boolean;
	/** requires admin */
	hide_from_search?: boolean;
	/** requires janitor */
	background_color?: string;
	/** requires admin */
	locked_tags?: Array<string> | string;
}

export interface PostVoteResult {
	score: number;
	up: number;
	down: number;
	our_score: number;
}

export interface PostHistoryProperties {
	id: number;
	post_id: number;
	tags: string;
	updater_id: number | null;
	updater_name: string;
	updated_at: string;
	rating: Ratings | null;
	parent_id: number | null;
	source: string | null;
	description: string | null;
	reason: string | null;
	locked_tags: string | null;
	added_tags: Array<string>;
	removed_tags: Array<string>;
	added_locked_tags: Array<string>;
	removed_locked_tags: Array<string>;
	rating_changed: boolean;
	parent_changed: boolean;
	source_changed: boolean;
	description_changed: boolean;
	version: number;
	obsolete_added_tags: string;
	obsolete_removed_tags: string;
	unchanged_tags: string;
}

export interface SearchPostHistoryOptions extends GenericSearchOptions {
	id?: number;
	user?: string;
	user_id?: number;
	post?: number;
	reason?: string;
	description?: string;
	rating_changed_to?: Ratings;
	final_rating?: Ratings;
	parent?: number;
	parent_changed_to?: number;
	final_tags?: Array<string> | string;
	added_tags?: Array<string> | string;
	removed_tags?: Array<string> | string;
	final_locked_tags?: Array<string> | string;
	added_locked_tags?: Array<string> | string;
	removed_locked_tags?: Array<string> | string;
	source?: string;
}

export interface PostApprovalProperties {
	id: number;
	user_id: number;
	post_id: number;
	created_at: string;
	updated_at: string;
}

export interface SearchPostApprovalsOptions extends GenericSearchOptions {
	id?: number;
	approver?: string;
	tags?: Array<string> | string;
}
