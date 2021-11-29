import type Post from "./Post";
import type { TagProperties, SearchPostsOptions, ModifyTagOptions, SearchTagHistoryOptions } from "../types";
import type E621 from "..";

export default class Tag implements TagProperties {
	private main: E621;
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
	constructor(main: E621, info: TagProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get posts with this tag (and others, if specified)
	 *
	 * @param {object} [options]
	 * @param {(Array<string> | string)} [options.tags] - narrow the search by specific tags
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - number for exact page, a${number} posts after ${number}, b${number} posts before ${number}
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 *
	 * @returns {Promise<Array<Post>>}
	 */
	async getPosts(options?: SearchPostsOptions) { return this.main.posts.search.call(this.main.posts, { ...(options ?? {}), tags: [this.name, ...(options?.tags ?? [])] }); }

	/**
	 * Fetch all posts with this tag (and extras, if specified)
	 *
	 * @param {Array<string>} [extraTags] - the additional tags for searching
	 * @param {number} [lastID] - internal use only
	 * @param {Array<Post>} [lastPosts] - internal use only
	 * @returns
	 */
	async getAllPosts(extraTags?: Array<string>, lastID?: number, lastPosts: Array<Post> = []): Promise<Array<Post>> {
		const posts = await this.main.posts.search({
			tags: [this.name, ...(extraTags ?? [])],
			page: lastID === undefined ? undefined : `b${lastID}`,
			limit: this.main.POST_LIMIT_PER_REQUEST
		});
		lastPosts.push(...posts);
		if (posts.length === this.main.POST_LIMIT_PER_REQUEST) return this.getAllPosts(extraTags, lastID, lastPosts);
		else return lastPosts;
	}
	/**
	 * modify this tag
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {number} [options.category] - the category of the tag
	 * @param {string} [options.locked] - if the tag is locked (requires moderator)
	 * @returns {Promise<Tag>}
	 */
	async modify(options: ModifyTagOptions) {
		this.main.request.authCheck("Pool#modify");
		if (!options) throw new Error("options is required in Tags#modify");
		return this.main.tags.modify.call(this.main.tags, this.id, options);
	}

	/**
	 * Search this tag's history
	 *
	 * @param {object} [options]
	 * @param {number} [options.uerName] - page of results to get
	 * @param {number} [options.userID] - page of results to get
	 * @param {number} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @param
	 * @returns {Promise<Array<PoolHistory>>}
	 */
	async getHistory(options?: Omit<SearchTagHistoryOptions, "tag">) {
		return this.main.pools.searchHistory.call(this.main.pools, { pool: this.id, ...options });
	}
}
