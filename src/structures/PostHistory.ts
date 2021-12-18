import type User from "./User";
import type Post from "./Post";
import type { PostHistoryProperties, Ratings } from "../types";
import type E621 from "..";

export default class PostHistory implements PostHistoryProperties {
	private main: E621;
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
	extra: Readonly<Record<
	"tags" | "lockedTags" | "addedTags" |
	"removedTags" | "addedLockedTags" | "removedLockedTags" |
	"obsoleteAddedTags" | "obsoleteRemovedTags" | "unchangedTags" |
	"sources" | "addedSources" | "removedSources",
	Array<string>> & Record<"oldRating" | "newRating", Ratings | null>>;
	constructor(main: E621, info: PostHistoryProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});

		this.extra = {
			get tags() { return info.tags.split(" ").filter(Boolean); },
			get lockedTags() { return (info.locked_tags || "").split(" "); },
			get addedTags() { return (info.added_tags || []).filter(Boolean); },
			get removedTags() { return (info.removed_tags || []).filter(Boolean); },
			get addedLockedTags() { return (info.added_locked_tags || []).filter(Boolean); },
			get removedLockedTags() { return (info.added_locked_tags || []).filter(Boolean); },
			get obsoleteAddedTags() { return (info.obsolete_added_tags || "").split(" ").filter(Boolean); },
			get obsoleteRemovedTags() { return (info.obsolete_removed_tags || "").split(" ").filter(Boolean); },
			get unchangedTags() { return (info.unchanged_tags || "").split(" ").filter(Boolean); },
			get sources() { return (info.source || "").split("\n").filter(Boolean); },
			// convinence method
			get oldRating() {
				if (!info.rating_changed) return null;
				const r = this.removedTags.find(t => t.startsWith("rating:"));
				return !r ? null : r.replace(/rating:/, "") as "s";
			},
			// convinence method
			get newRating() {
				if (!info.rating_changed) return null;
				const r = this.addedTags.find(t => t.startsWith("rating:"));
				return !r ? null : r.replace(/rating:/, "") as "s";
			},
			// convinence method
			get addedSources() { return (this.addedTags.find(t => t.startsWith("source:"))?.replace(/source:/, "") ?? "").split("\n"); },
			// convinence method
			get removedSources() { return (this.removedTags.find(t => t.startsWith("source:"))?.replace(/source:/, "") ?? "").split("\n"); }
		};
	}

	/**
	 * Get the updater for this history
	 *
	 * @returns {Promise<User | null>}
	 */
	async getUpdater() { return this.updater_id === null ? null : this.main.users.get.call(this.main.users, this.updater_id); }

	/**
	 * Get the post object for this history
	 *
	 * @returns {Promise<Post | null>}
	 */
	async getPost() { return this.main.posts.get.call(this.main.posts, this.post_id); }


	/**
	 * Revert the post to this version
	 *
	 * * Requires Authentication
	 *
	 */
	async revertTo() {
		this.main.request.authCheck("PostHistory#revertTo");
		return this.main.posts.revert.call(this.main.posts, this.post_id, this.id);
	}
}
