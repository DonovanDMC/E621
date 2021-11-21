import type E621 from "..";
import type {
	UserFeedbackProperties,
	SearchUserFeedbackOptions,
	CreateUserFeedbackOptions,
	ModifyUserFeedbackOptions,
	FeedbackCategories
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";

export default class UserFeedback {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: UserFeedback) {
					return !this.main.options.authUser || !this.main.options.authKey ? null : `Basic ${Buffer.from(`${this.main.options.authUser}:${this.main.options.authKey}`).toString("base64")}`;
				},
				configurable: false,
				enumerable: false
			},
			main: {
				value: main,
				configurable: false,
				enumerable: false,
				writable: false
			}
		});
	}

	/**
	 * Get a specific user feedback
	 *
	 * @param {number} id - The id of the feedback to fetch
	 * @returns {Promise<(UserFeedbackProperties | null)>}
	 */
	async get(id: number) {
		const res = await this.main.request.get<UserFeedbackProperties>(`/user_feedbacks/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res;
	}

	/**
	 * Search for user feedback
	 *
	 * @param {object} [options]
	 * @param {string} [options.username] - narrow the search by a specific target
	 * @param {string} [options.creator] - narrow the search by a specific creator
	 * @param {string} [options.body] - narrow the search by the content of the feedback
	 * @param {FeedbackCategories} [options.category] - narrow the search by the type
	 * @param {(number |`${"" | "a" | "b"}${number}`)} - page of results to get
	 * @param {number} [options.limit] - limit the maximum returned results
	 * @returns {Promise<Array<UserFeedbackProperties>>}
	 */
	async search(options?: SearchUserFeedbackOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.username === "string")    qs.add("search[user_name]", options.username);
		if (typeof options.creator  === "string")    qs.add("search[creator_name]", options.creator);
		if (typeof options.body     === "string")    qs.add("search[body_matches]", options.body);
		if (typeof options.category === "string")    qs.add("search[category]", options.category);
		if (typeof options.page     !== "undefined") qs.add("page", options.page);
		if (typeof options.limit    === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<UserFeedbackProperties>>(`/user_feedbacks.json?${qs.build()}`);
		return res!;
	}

	/**
	 * Add feedback to a user
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {object} options
	 * @param {string} options.username - the user the feedback is for
	 * @param {FeedbackCategories} options.category - the type of feedback
	 * @param {string} options.body - the content of the feedback
	 * @returns {Promise<UserFeedbackProperties>}
	 */
	async create(options: CreateUserFeedbackOptions) {
		this.main.request.authCheck.call(this, "UserFeedback#create");
		const qs = new FormHelper()
			.add("user_feedback[user_name]", options.username)
			.add("user_feedback[category]", options.category)
			.add("user_feedback[body]", options.body);
		const res = await this.main.request.post<UserFeedbackProperties>("/user_feedbacks.json", qs.build());
		return res!;
	}

	/**
	 * Modify an existing user feedback
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {number} id - the id of the feedback to edit
	 * @param {object} options
	 * @param {string} [options.body] - the content of the feedback
	 * @param {FeedbackCategories} [options.category] - the type of feedback
	 * @returns {Promise<UserFeedbackProperties>}
	 */
	async modify(id: number, options: ModifyUserFeedbackOptions) {
		this.main.request.authCheck.call(this, "UserFeedback#modify");
		const qs = new FormHelper();
		if (options.body) qs.add("user_feedback[body]", options.body);
		if (options.category) qs.add("user_feedback[category]", options.category);
		const res = await this.main.request.patch<UserFeedbackProperties>(`/user_feedbacks/${id}.json`, qs.build());
		return res!;
	}

	/**
	 * Delete an existing user feedback
	 *
	 * * Requires Authentication
	 *
	 * * Requires Moderator
	 *
	 * @param {number} id - the id of the feedback to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "UserFeedback#delete");
		const res = await this.main.request.delete<null>(`/user_feedbacks/${id}.json`);
		return res;
	}
}
