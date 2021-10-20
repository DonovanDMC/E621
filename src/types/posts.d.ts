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
		has_childeren: boolean;
		has_active_childeren: boolean;
		childeren: Array<number>;
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
	page?: number | `${number}` | `${"a" | "b"}${number}`;
}

export type CreatePostOptions = {
	tags: Array<string> | string;
	rating: Ratings;
	sources?: Array<string> | string;
	description?: string;
	parentID?: number;
	refererURL?: string;
	md5Confirmation?: string;
	/** requires approver */
	asPending?: boolean;
	/** requires privileged */
	ratingLocked?: boolean;
	/** requires admin */
	lockedTags?: Array<string> | string;
} & ({
	file: Buffer;
} | {
	fileURL: string;
});

export interface NewPost {
	success: true;
	location: `/posts/${number}`;
	post_id: number;
}

export interface ModifyPostOptions {
	editReason?: string;
	addTags?: Array<string> | string;
	removeTags?: Array<string> | string;
	addSources?: Array<string> | string;
	removeSources?: Array<string> | string;
	rating?: Ratings;
	description?: string;
	parentID?: number;
	hasEmbeddedNotes?: boolean;
	/** requires privileged */
	ratingLocked?: boolean;
	/** requires janitor */
	noteLocked?: boolean;
	/** requires admin */
	statusLocked?: boolean;
	/** requires admin */
	hideFromAnonymous?: boolean;
	/** requires admin */
	hideFromSearch?: boolean;
	/** requires janitor */
	backgroundColor?: string;
	/** requires admin */
	lockedTags?: Array<string> | string;
}

export interface PostVoteResult {
	score: number;
	up: number;
	down: number;
	our_score: number;
}
