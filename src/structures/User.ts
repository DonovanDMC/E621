import type Post from "./Post";
import type E621 from "..";
import type {
	UserProperties,
	SearchUserFeedbackOptions,
	CreateUserFeedbackOptions,
	UserFeedbackProperties,
	FeedbackCategories,
	GenericSearchOptions
} from "../types";

export default class User implements UserProperties {
	protected readonly main: E621;
	wiki_page_version_count: number;
	artist_version_count: number;
	pool_version_count: number;
	forum_post_count: number;
	comment_count: number;
	appeal_count: number;
	flag_count: number;
	positive_feedback_count: number;
	neutral_feedback_count: number;
	negative_feedback_count: number;
	upload_limit: number;
	id: number;
	created_at: string;
	name: string;
	level: number;
	base_upload_limit: number;
	post_upload_count: number;
	post_update_count: number;
	note_update_count: number;
	is_banned: boolean;
	can_approve_posts: boolean;
	can_upload_free: boolean;
	level_string: string;
	avatar_id: number | null;
	constructor(main: E621, info: UserProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value:        main,
			configurable: false,
			enumerable:   false,
			writable:     false
		});
	}

	/**
	 * Get the feedback associated with this user
	 *
	 * @param {object} [options] - Options for narrowing the search
	 * @param {string} [options.creator] - the creator of the feedback
	 * @param {string} [options.body] - the body of the feedback
	 * @param {FeedbackCategories} [options.category] - the type of feedback
	 * @param {number} [options.limit] - the maximum amount of feedback to fetch
	 * @returns {Array<UserFeedbackProperties>}
	 */
	async getFeedback(options: Omit<SearchUserFeedbackOptions, "username">) { return this.main.userFeedback.search.call(this.main.userFeedback, { username: this.name, ...options }); }

	/**
	 * Create a feedback for this user
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {object} options
	 * @param {FeedbackCategories} options.category - the type of feedback
	 * @param {string} options.body - the body of the feedback
	 * @returns
	 */
	async createFeedback(options: Omit<CreateUserFeedbackOptions, "username">) {
		this.main.request.authCheck.call(this, "User#createFeedback");
		return this.main.userFeedback.create.call(this.main.userFeedback, { username: this.name, ...options });
	}

	/**
	 * Get this users favorites
	 *
	 * @param {object} [options]
	 * @param {number} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<Post>>}
	 */
	async getFavorites(options?: GenericSearchOptions) { return this.main.users.getFavorites({ id: this.id, ...options }); }

	async asAuthenticatedUser() {
		this.main.request.authCheck("User#asAuthenticatedUser");
		const info = await this.main.users.getSelf.call(this.main.users);
		if (info.id !== this.id) throw new Error("User#asAuthenticatedUser called on a different user");
		return info;
	}
}
