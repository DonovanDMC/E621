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
	"tags" | "locked_tags" | "added_tags" |
	"removed_tags" | "added_locked_tags" | "removed_locked_tags" |
	"obsolete_added_tags" | "obsolete_removed_tags" | "unchanged_tags" |
	"sources" | "added_sources" | "removed_sources",
	Array<string>> & Record<"old_rating" | "new_rating", Ratings | null>>;
	constructor(main: E621, info: PostHistoryProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value:        main,
			configurable: false,
			enumerable:   false,
			writable:     false
		});

		this.extra = {
			get tags() { return info.tags.split(" ").filter(Boolean); },
			get locked_tags() { return (info.locked_tags || "").split(" "); },
			get added_tags() { return (info.added_tags || []).filter(Boolean); },
			get removed_tags() { return (info.removed_tags || []).filter(Boolean); },
			get added_locked_tags() { return (info.added_locked_tags || []).filter(Boolean); },
			get removed_locked_tags() { return (info.added_locked_tags || []).filter(Boolean); },
			get obsolete_added_tags() { return (info.obsolete_added_tags || "").split(" ").filter(Boolean); },
			get obsolete_removed_tags() { return (info.obsolete_removed_tags || "").split(" ").filter(Boolean); },
			get unchanged_tags() { return (info.unchanged_tags || "").split(" ").filter(Boolean); },
			get sources() { return (info.source || "").split("\n").filter(Boolean); },
			// convinence method
			get old_rating() {
				if (!info.rating_changed) return null;
				const r = this.removed_tags.find(t => t.startsWith("rating:"));
				return !r ? null : r.replace(/rating:/, "") as "s";
			},
			// convinence method
			get new_rating() {
				if (!info.rating_changed) return null;
				const r = this.added_tags.find(t => t.startsWith("rating:"));
				return !r ? null : r.replace(/rating:/, "") as "s";
			},
			// convinence method
			get added_sources() { return (this.added_tags.find(t => t.startsWith("source:"))?.replace(/source:/, "") ?? "").split("\n"); },
			// convinence method
			get removed_sources() { return (this.removed_tags.find(t => t.startsWith("source:"))?.replace(/source:/, "") ?? "").split("\n"); }
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
