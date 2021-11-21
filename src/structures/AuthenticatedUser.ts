import User from "./User";
import type Post from "./Post";
import type E621 from "..";
import type {
	AuthenticatedUserProperties,
	DefaultImageSize,
	UploadLimit,
	EditSelfUserOptions,
	Timezones
} from "../types";

export default class AuthenticatedUser extends User implements AuthenticatedUserProperties {
	show_avatars: boolean;
	blacklist_avatars: boolean;
	blacklist_users: boolean;
	description_collapsed_initially: boolean;
	hide_comments: boolean;
	show_hidden_comments: boolean;
	show_post_statistics: boolean;
	has_mail: boolean;
	receive_email_notifications: boolean;
	enable_keyboard_navigation: boolean;
	enable_privacy_mode: boolean;
	style_usernames: boolean;
	enable_auto_complete: boolean;
	has_saved_searches: boolean;
	disable_cropped_thumbnails: boolean;
	disable_mobile_gestures: boolean;
	enable_safe_mode: boolean;
	disable_responsive_mode: boolean;
	disable_post_tooltips: boolean;
	no_flagging: boolean;
	no_feedback: boolean;
	disable_user_dmails: boolean;
	enable_compact_uploader: boolean;
	updated_at: string;
	email: string;
	last_logged_in_at: string;
	last_forum_read_at: string | null;
	recent_tags: string | null;
	comment_threshold: number;
	default_image_size: DefaultImageSize;
	favorite_tags: string | null;
	blacklisted_tags: string;
	time_zone: string;
	per_page: number;
	custom_style: string | null;
	favorite_count: number;
	api_regen_multiplier: number;
	api_burst_limit: number;
	remaining_api_limit: number;
	statement_timeout: number;
	favorite_limit: number;
	tag_query_limit: number;
	constructor(main: E621, info: AuthenticatedUserProperties) {
		super(main, info);
		Object.assign(this, info);
	}

	/**
	 * Edit the authenticated user
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {(number | null)} [options.avatarID] - post id to use as avatar
	 * @param {string} [options.about] - about section
	 * @param {string} [options.artinfo] - commissions section
	 * @param {Timezones} [options.timezone] - timezone
	 * @param {boolean} [options.receiveEmailNotifications] - if you should receive notifications via email
	 * @param {number} [options.commentThreshold] - the threshold at which comments should be hidden (usually negative)
	 * @param {DefaultImageSize} [options.defaultImageSize] - default image display size
	 * @param {number} [options.postsPerPage] - default posts per page, between 25 and 250
	 * @param {boolean} [options.safeMode] - toggle safe mode
	 * @param {(Array<string> | string)} [options.blacklistedTags] - the list of tags to hide in searches
	 * @param {boolean} [options.blacklistUsers] - hide things from users that have been blocked from the site
	 * @param {boolean} [options.coloredUsernames] - Color each user's name depending on their level. See the [legend](https://e621.net/wiki_pages/e621:colored_usernames) for what the colors are.
	 * @param {boolean} [options.enableKeyboardShortcuts] - Enables the use of keyboard shortcuts for a majority of site actions related to posts. A list of keyboard shortcuts is available [here](https://e621.net/static/keyboard_shortcuts).
	 * @param {boolean} [options.enableAutoComplete] - Enables auto-completion on most tag and user entry fields.
	 * @param {boolean} [options.enablePrivacyMode] - Makes a cursory effort to prevent showing your favorites to others users. Has not been well tested.
	 * @param {boolean} [options.enablePostStatistics] - Show post statistics below posts on search pages.
	 * @param {boolean} [options.descriptionCollapsed] - Don't expand post descriptions on page load.
	 * @param {boolean} [options.hideComments] - Do not show the comments section on post pages.
	 * @param {boolean} [options.disableCroppedThumbnails] - Prevent other users from sending you DMails. You will be prevented from sending DMails to non-staff members while this option is enabled. Staff are always allowed to send you DMails.
	 * @param {boolean} [options.showOwnHiddenComments] - Disables displaying cropped thumbnails on the mobile layout of the site in favor of scaled thumbnails. Has no effect on the desktop site.
	 * @param {boolean} [options.enableCompactUploader] - Show your own hidden comments on comment pages.
	 * @param {string} [options.dmailFilter] - A list of banned words (space delimited). Any dmail you receive with a banned word will automatically be deleted.
	 * @param {string} [options.frequentTags] - A list of tags that you use often. They will appear when using the list of Related Tags.
	 * @param {boolean} [options.disableResponsiveMode] - Disable alternative layout for mobile and tablet.
	 * @param {string} [options.customCSSStyle] - Style to apply to the whole site.
	 * @returns {Promise<null>}
	 */
	async edit(options: EditSelfUserOptions) {
		this.main.request.authCheck("AuthenticatedUser#edit");
		return this.main.users.editSelf(options);
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
		this.main.request.authCheck("AuthenticatedUser#addFavorite");
		return this.main.users.addFavorite(id);
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
		this.main.request.authCheck("AuthenticatedUser#removeFavorite");
		return this.main.users.removeFavorite(id);
	}

	/**
	 * Get the authenticated user's /users/upload_limit (AuthenticatedUser specific properties)
	 *
	 * * Authentication Required
	 *
	 * @returns {Promise<UploadLimit>}
	 */
	async getUploadLimit() {
		this.main.request.authCheck("AuthenticatedUser#getUploadLimit");
		return this.main.users.getUploadLimit();
	}
}
