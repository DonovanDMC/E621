import type E621 from "..";
import AuthenticatedUser from "../structures/AuthenticatedUser";
import Post from "../structures/Post";
import User from "../structures/User";
import type {
	AuthenticatedUserProperties,
	UploadLimit,
	UserProperties,
	SearchUsersOptions,
	EditSelfUserOptions,
	SearchUsersOrder,
	Timezones,
	DefaultImageSize,
	PostProperties
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";

export default class Users {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: Users) {
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
	 * Get a user by their id or username
	 *
	 * Use `getSelf` to get the currently authenticated user
	 *
	 * @param {(number | string)} idOrname - The id or username of the user to get
	 * @returns {Promise<(User | null)>}
	 */
	async get(idOrName: number | string) {
		const res = await this.main.request.get<UserProperties>(`/users/${idOrName}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new User(this.main, res);
	}

	/**
	 * Get a user by their name
	 *
	 * @param {string} name - The name of the user to get
	 * @returns {Promise<(User | null)>}
	 */
	async getByName(name: string) {
		return this.search({
			name,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Search for users
	 *
	 * @param {object} [options]
	 * @param {string} [options.name] - narrow the search by usernames
	 * @param {string} [options.email] - narrow the search by email (requires admin)
	 * @param {number} [options.level] - narrow the search by user level
	 * @param {number} [options.min_level] - narrow the search by minimum user level
	 * @param {number} [options.max_level] - narrow the search by maximum user level
	 * @param {boolean} [options.unrestricted_uploads] - narrow the search by unrestricted uploaders
	 * @param {boolean} [options.approver] - narrow the search by approvers
	 * @param {SearchUsersOrder} [options.order] - order the search results
	 * @param {(number |`${"" | "a" | "b"}${number}`)} - page to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<User>>}
	 */
	async search(options?: SearchUsersOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.name                 === "string")     qs.add("search[name_matches]", options.name);
		if (typeof options.email                === "string")     qs.add("search[email_matches]", options.email);
		if (typeof options.level                === "number")     qs.add("search[level]", options.level);
		if (typeof options.min_level            === "number")     qs.add("search[min_level]", options.min_level);
		if (typeof options.max_level            === "number")     qs.add("search[max_level]", options.max_level);
		if (typeof options.unrestricted_uploads === "boolean")    qs.add("search[can_upload_free]", options.unrestricted_uploads);
		if (typeof options.approver             === "boolean")    qs.add("search[can_approve_posts]", options.approver);
		if (typeof options.order                === "string")     qs.add("search[order]", options.order);
		if (typeof options.page                 !== "undefined")  qs.add("page", options.page);
		if (typeof options.limit                === "number")     qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<UserProperties>>(`/users.json?${qs.build()}`);
		return res!.map(info => new User(this.main, info));
	}

	/**
	 * Get the currently authenticated user
	 *
	 * * Authentication Required
	 *
	 * @returns {Promise<AuthenticatedUser>}
	 */
	async getSelf() {
		this.main.request.authCheck.call(this, "Users#getSelf");
		const { id } = await this.getUploadLimit();
		const res = await this.main.request.get<AuthenticatedUserProperties>(`/users/${id}.json`);
		return new AuthenticatedUser(this.main, res!);
	}

	/**
	 * Edit the authenticated user
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {(number | null)} [options.avatar_id] - post id to use as avatar
	 * @param {string} [options.about] - about section
	 * @param {string} [options.artinfo] - commissions section
	 * @param {Timezones} [options.timezone] - timezone
	 * @param {boolean} [options.receive_email_notifications] - if you should receive notifications via email
	 * @param {number} [options.comment_threshold] - the threshold at which comments should be hidden (usually negative)
	 * @param {DefaultImageSize} [options.default_image_size] - default image display size
	 * @param {number} [options.posts_per_page] - default posts per page, between 25 and 250
	 * @param {boolean} [options.safe_mode] - toggle safe mode
	 * @param {(Array<string> | string)} [options.blacklisted_tags] - the list of tags to hide in searches
	 * @param {boolean} [options.blacklist_users] - hide things from users that have been blocked from the site
	 * @param {boolean} [options.colored_usernames] - Color each user's name depending on their level. See the [legend](https://e621.net/wiki_pages/e621:colored_usernames) for what the colors are.
	 * @param {boolean} [options.enable_keyboard_shortcuts] - Enables the use of keyboard shortcuts for a majority of site actions related to posts. A list of keyboard shortcuts is available [here](https://e621.net/static/keyboard_shortcuts).
	 * @param {boolean} [options.enable_auto_complete] - Enables auto-completion on most tag and user entry fields.
	 * @param {boolean} [options.enable_privacy_mode] - Makes a cursory effort to prevent showing your favorites to others users. Has not been well tested.
	 * @param {boolean} [options.enable_post_statistics] - Show post statistics below posts on search pages.
	 * @param {boolean} [options.description_collapsed] - Don't expand post descriptions on page load.
	 * @param {boolean} [options.hide_comments] - Do not show the comments section on post pages.
	 * @param {boolean} [options.disable_cropped_thumbnails] - Prevent other users from sending you DMails. You will be prevented from sending DMails to non-staff members while this option is enabled. Staff are always allowed to send you DMails.
	 * @param {boolean} [options.show_own_hidden_comments] - Disables displaying cropped thumbnails on the mobile layout of the site in favor of scaled thumbnails. Has no effect on the desktop site.
	 * @param {boolean} [options.enable_compact_uploader] - Show your own hidden comments on comment pages.
	 * @param {string} [options.dmail_filter] - A list of banned words (space delimited). Any dmail you receive with a banned word will automatically be deleted.
	 * @param {string} [options.frequent_tags] - A list of tags that you use often. They will appear when using the list of Related Tags.
	 * @param {boolean} [options.disable_responsive_mode] - Disable alternative layout for mobile and tablet.
	 * @param {string} [options.custom_css_style] - Style to apply to the whole site.
	 * @returns {Promise<null>}
	 */
	async editSelf(options: EditSelfUserOptions) {
		this.main.request.authCheck.call(this, "Users#editSelf");
		if (!options) throw new Error("options is required for Users#editSelf");
		const qs = new FormHelper();
		if (options.avatar_id === null || typeof options.avatar_id === "string") qs.add("user[avatar_id]", options.avatar_id || "");
		if (typeof options.about                       === "string")  qs.add("user[profile_about]", options.about);
		if (typeof options.artinfo                     === "string")  qs.add("user[profile_artinfo]", options.artinfo);
		if (typeof options.timezone                    === "string")  qs.add("user[time_zone]", options.timezone);
		if (typeof options.receive_email_notifications === "boolean") qs.add("user[receive_email_notifications]", options.receive_email_notifications);
		if (typeof options.comment_threshold           === "number")  qs.add("user[comment_threshold]", options.comment_threshold);
		if (typeof options.default_image_size          === "number" && options.default_image_size >= 25 && options.default_image_size <= 250) qs.add("user[default_image_size]", options.default_image_size);
		if (typeof options.posts_per_page              === "number")  qs.add("user[per_page]", options.posts_per_page);
		if (typeof options.safe_mode                   === "boolean") qs.add("user[enable_safe_mode]", options.safe_mode);
		if (typeof options.blacklisted_tags            === "string" || Array.isArray(options.blacklisted_tags)) qs.add("user[blacklisted_tags]", Array.isArray(options.blacklisted_tags) ? options.blacklisted_tags.join("\n") : options.blacklisted_tags);
		if (typeof options.blacklist_users             === "boolean") qs.add("user[blacklist_users]", options.blacklist_users);
		// Advanced
		if (typeof options.colored_usernames           === "boolean") qs.add("user[style_usernames]", options.colored_usernames);
		if (typeof options.enable_keyboard_shortcuts   === "boolean") qs.add("user[enable_keyboard_navigation]", options.enable_keyboard_shortcuts);
		if (typeof options.enable_auto_complete        === "boolean") qs.add("user[enable_auto_complete]", options.enable_auto_complete);
		if (typeof options.enable_privacy_mode         === "boolean") qs.add("user[enable_privacy_mode]", options.enable_privacy_mode);
		if (typeof options.enable_post_statistics      === "boolean") qs.add("user[show_post_statistics]", options.enable_post_statistics);
		if (typeof options.description_collapsed       === "boolean") qs.add("user[description_collapsed_initially]", options.description_collapsed);
		if (typeof options.hide_comments               === "boolean") qs.add("user[hide_comments]", options.hide_comments);
		if (typeof options.disable_cropped_thumbnails  === "boolean") qs.add("user[disable_cropped_thumbnails]", options.disable_cropped_thumbnails);
		if (typeof options.show_own_hidden_comments    === "boolean") qs.add("user[show_hidden_comments]", options.show_own_hidden_comments);
		if (typeof options.enable_compact_uploader     === "boolean") qs.add("user[enable_compact_uploader]", options.enable_compact_uploader);
		if (typeof options.dmail_filter                === "string")  qs.add("user[dmail_filter_attributes][words]", options.dmail_filter);
		if (typeof options.frequent_tags               === "string")  qs.add("user[favorite_tags]", options.frequent_tags);
		if (typeof options.disable_responsive_mode     === "boolean") qs.add("user[disable_responsive_mode]", options.disable_responsive_mode);
		if (typeof options.custom_css_style            === "string")  qs.add("user[custom_style]", options.custom_css_style);
		//                                             any id goes to to the current user
		const res = await this.main.request.patch<null>("/users/0.json", qs.build());
		return res;
	}

	/**
	 * Get the authenticated user's /users/upload_limit (best way I can find to find out who you are)
	 *
	 * * Authentication Required
	 *
	 * @returns {Promise<UploadLimit>}
	 */
	async getUploadLimit() {
		this.main.request.authCheck.call(this, "Users#getUploadLimit");
		const res = await this.main.request.get<UploadLimit>("/users/upload_limit.json");
		return res!;
	}

	/**
	 * Get the favorites of a user
	 *
	 * @param {number} [id] - the id of the user to get favorites for, or none to get the authenticated user, if provided
	 */
	async getFavorites(id?: number) {
		if (!id) {
			const auth = this.main.request.authCheck.call(this, "Users#getFavorites", false);
			if (!auth) throw new Error("calling Users#getFavorites without an id requires authentication");
		}
		const res = await this.main.request.get<{ posts: Array<PostProperties>; }>(`/favorites.json${!id ? "" : `?user_id=${id}`}`);
		return res!.posts.map(info => new Post(this.main, info));
	}

	/**
	 * Add a favorite
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to favorite
	 * @returns {Promise<Post>}
	 */
	async addFavorite(id: number) {
		this.main.request.authCheck.call(this, "Users#addFavorite");
		const res = await this.main.request.get<{ post: PostProperties; }>(`/favorites.json?post_id=${id}`);
		return new Post(this.main, res!.post);
	}

	/**
	 * Remove a favorite
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to unfavorite
	 * @returns {Promise<null>}
	 */
	async removeFavorite(id: number) {
		this.main.request.authCheck.call(this, "Users#removeFavorite");
		return this.main.request.delete<null>(`/favorites/${id}.json`);
	}
}
