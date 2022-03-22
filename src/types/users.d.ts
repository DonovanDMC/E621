import type { GenericSearchOptions } from ".";

export interface UserProperties {
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
	level: number; // not hardcoded due to custom instances
	base_upload_limit: number;
	post_upload_count: number;
	post_update_count: number;
	note_update_count: number;
	is_banned: boolean;
	can_approve_posts: boolean;
	can_upload_free: boolean;
	level_string: string; // not hardcoded due to custom instances
	avatar_id: number | null;
}

export type DefaultImageSize = "original" | "fit" | "fitv" | "large";
export interface AuthenticatedUserProperties extends UserProperties {
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
	default_image_size: DefaultImageSize; // this *can* be different on custom instances, but I doubt anyone would change these
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
}

export type UploadLimit = Omit<AuthenticatedUserProperties,
"wiki_page_version_count" | "artist_version_count" | "pool_version_count" | "forum_post_count" |
"comment_count" | "appeal_count" | "flag_count" | "positive_feedback_count" |
"neutral_feedback_count" | "negative_feedback_count" | "upload_limit"
>;

export type SearchUsersOrder = "date" | "name" | "post_upload_count" | "note_count" | "post_update_count";
export interface SearchUsersOptions extends GenericSearchOptions {
	/** use asterisks for wildcards */
	name?: string;
	/** requires admin */
	email?: string;
	level?: number;
	min_level?: number;
	max_level?: number;
	unrestricted_uploads?: boolean;
	approver?: boolean;
	order?: SearchUsersOrder;
}

export type Timezones =
"International Date Line West" | // (GMT-12:00) International Date Line West
"American Samoa" | // (GMT-11:00) American Samoa
"Midway Island" | // (GMT-11:00) Midway Island
"Hawaii" | // (GMT-10:00) Hawaii
"Alaska" | // (GMT-09:00) Alaska
"Pacific Time (US &amp; Canada)" | // (GMT-08:00) Pacific Time (US &amp; Canada)
"Tijuana" | // (GMT-08:00) Tijuana
"Arizona" | // (GMT-07:00) Arizona
"Chihuahua" | // (GMT-07:00) Chihuahua
"Mazatlan" | // (GMT-07:00) Mazatlan
"Mountain Time (US & Canada)" | // (GMT-07:00) Mountain Time (US &amp; Canada)
"Central America" | // (GMT-06:00) Central America
"Central Time (US & Canada)" | // (GMT-06:00) Central Time (US &amp; Canada)
"Guadalajara" | // (GMT-06:00) Guadalajara
"Mexico City" | // (GMT-06:00) Mexico City
"Monterrey" | // (GMT-06:00) Monterrey
"Saskatchewan" | // (GMT-06:00) Saskatchewan
"Bogota" | // (GMT-05:00) Bogota
"Eastern Time (US & Canada)" | // (GMT-05:00) Eastern Time (US &amp; Canada)
"Indiana (East)" | // (GMT-05:00) Indiana (East)
"Lima" | // (GMT-05:00) Lima
"Quito" | // (GMT-05:00) Quito
"Atlantic Time (Canada)" | // (GMT-04:00) Atlantic Time (Canada)
"Caracas" | // (GMT-04:00) Caracas
"Georgetown" | // (GMT-04:00) Georgetown
"La Paz" | // (GMT-04:00) La Paz
"Puerto Rico" | // (GMT-04:00) Puerto Rico
"Santiago" | // (GMT-04:00) Santiago
"Newfoundland" | // (GMT-03:30) Newfoundland
"Brasilia" | // (GMT-03:00) Brasilia
"Buenos Aires" | // (GMT-03:00) Buenos Aires
"Greenland" | // (GMT-03:00) Greenland
"Montevideo" | // (GMT-03:00) Montevideo
"Mid-Atlantic" | // (GMT-02:00) Mid-Atlantic
"Azores" | // (GMT-01:00) Azores
"Cape Verde Is." | // (GMT-01:00) Cape Verde Is.
"Edinburgh" | // (GMT+00:00) Edinburgh
"Lisbon" | // (GMT+00:00) Lisbon
"London" | // (GMT+00:00) London
"Monrovia" | // (GMT+00:00) Monrovia
"UTC" | // (GMT+00:00) UTC
"Amsterdam" | // (GMT+01:00) Amsterdam
"Belgrade" | // (GMT+01:00) Belgrade
"Berlin" | // (GMT+01:00) Berlin
"Bern" | // (GMT+01:00) Bern
"Bratislava" | // (GMT+01:00) Bratislava
"Brussels" | // (GMT+01:00) Brussels
"Budapest" | // (GMT+01:00) Budapest
"Casablanca" | // (GMT+01:00) Casablanca
"Copenhagen" | // (GMT+01:00) Copenhagen
"Dublin" | // (GMT+01:00) Dublin
"Ljubljana" | // (GMT+01:00) Ljubljana
"Madrid" | // (GMT+01:00) Madrid
"Paris" | // (GMT+01:00) Paris
"Prague" | // (GMT+01:00) Prague
"Rome" | // (GMT+01:00) Rome
"Sarajevo" | // (GMT+01:00) Sarajevo
"Skopje" | // (GMT+01:00) Skopje
"Stockholm" | // (GMT+01:00) Stockholm
"Vienna" | // (GMT+01:00) Vienna
"Warsaw" | // (GMT+01:00) Warsaw
"West Central Africa" | // (GMT+01:00) West Central Africa
"Zagreb" | // (GMT+01:00) Zagreb
"Zurich" | // (GMT+01:00) Zurich
"Athens" | // (GMT+02:00) Athens
"Bucharest" | // (GMT+02:00) Bucharest
"Cairo" | // (GMT+02:00) Cairo
"Harare" | // (GMT+02:00) Harare
"Helsinki" | // (GMT+02:00) Helsinki
"Jerusalem" | // (GMT+02:00) Jerusalem
"Kaliningrad" | // (GMT+02:00) Kaliningrad
"Kyiv" | // (GMT+02:00) Kyiv
"Pretoria" | // (GMT+02:00) Pretoria
"Riga" | // (GMT+02:00) Riga
"Sofia" | // (GMT+02:00) Sofia
"Tallinn" | // (GMT+02:00) Tallinn
"Vilnius" | // (GMT+02:00) Vilnius
"Baghdad" | // (GMT+03:00) Baghdad
"Istanbul" | // (GMT+03:00) Istanbul
"Kuwait" | // (GMT+03:00) Kuwait
"Minsk" | // (GMT+03:00) Minsk
"Moscow" | // (GMT+03:00) Moscow
"Nairobi" | // (GMT+03:00) Nairobi
"Riyadh" | // (GMT+03:00) Riyadh
"St. Petersburg" | // (GMT+03:00) St. Petersburg
"Volgograd" | // (GMT+03:00) Volgograd
"Tehran" | // (GMT+03:30) Tehran
"Abu Dhabi" | // (GMT+04:00) Abu Dhabi
"Baku" | // (GMT+04:00) Baku
"Muscat" | // (GMT+04:00) Muscat
"Samara" | // (GMT+04:00) Samara
"Tbilisi" | // (GMT+04:00) Tbilisi
"Yerevan" | // (GMT+04:00) Yerevan
"Kabul" | // (GMT+04:30) Kabul
"Ekaterinburg" | // (GMT+05:00) Ekaterinburg
"Islamabad" | // (GMT+05:00) Islamabad
"Karachi" | // (GMT+05:00) Karachi
"Tashkent" | // (GMT+05:00) Tashkent
"Chennai" | // (GMT+05:30) Chennai
"Kolkata" | // (GMT+05:30) Kolkata
"Mumbai" | // (GMT+05:30) Mumbai
"New Delhi" | // (GMT+05:30) New Delhi
"Sri Jayawardenepura" | // (GMT+05:30) Sri Jayawardenepura
"Kathmandu" | // (GMT+05:45) Kathmandu
"Almaty" | // (GMT+06:00) Almaty
"Astana" | // (GMT+06:00) Astana
"Dhaka" | // (GMT+06:00) Dhaka
"Urumqi" | // (GMT+06:00) Urumqi
"Rangoon" | // (GMT+06:30) Rangoon
"Bangkok" | // (GMT+07:00) Bangkok
"Hanoi" | // (GMT+07:00) Hanoi
"Jakarta" | // (GMT+07:00) Jakarta
"Krasnoyarsk" | // (GMT+07:00) Krasnoyarsk
"Novosibirsk" | // (GMT+07:00) Novosibirsk
"Beijing" | // (GMT+08:00) Beijing
"Chongqing" | // (GMT+08:00) Chongqing
"Hong Kong" | // (GMT+08:00) Hong Kong
"Irkutsk" | // (GMT+08:00) Irkutsk
"Kuala Lumpur" | // (GMT+08:00) Kuala Lumpur
"Perth" | // (GMT+08:00) Perth
"Singapore" | // (GMT+08:00) Singapore
"Taipei" | // (GMT+08:00) Taipei
"Ulaanbaatar" | // (GMT+08:00) Ulaanbaatar
"Osaka" | // (GMT+09:00) Osaka
"Sapporo" | // (GMT+09:00) Sapporo
"Seoul" | // (GMT+09:00) Seoul
"Tokyo" | // (GMT+09:00) Tokyo
"Yakutsk" | // (GMT+09:00) Yakutsk
"Adelaide" | // (GMT+09:30) Adelaide
"Darwin" | // (GMT+09:30) Darwin
"Brisbane" | // (GMT+10:00) Brisbane
"Canberra" | // (GMT+10:00) Canberra
"Guam" | // (GMT+10:00) Guam
"Hobart" | // (GMT+10:00) Hobart
"Melbourne" | // (GMT+10:00) Melbourne
"Port Moresby" | // (GMT+10:00) Port Moresby
"Sydney" | // (GMT+10:00) Sydney
"Vladivostok" | // (GMT+10:00) Vladivostok
"Magadan" | // (GMT+11:00) Magadan
"New Caledonia" | // (GMT+11:00) New Caledonia
"Solomon Is." | // (GMT+11:00) Solomon Is.
"Srednekolymsk" | // (GMT+11:00) Srednekolymsk
"Auckland" | // (GMT+12:00) Auckland
"Fiji" | // (GMT+12:00) Fiji
"Kamchatka" | // (GMT+12:00) Kamchatka
"Marshall Is." | // (GMT+12:00) Marshall Is.
"Wellington" | // (GMT+12:00) Wellington
"Chatham Is." | // (GMT+12:45) Chatham Is.
"Nuku'alofa" | // (GMT+13:00) Nuku'alofa
"Samoa" | // (GMT+13:00) Samoa
"Tokelau Is."; // (GMT+13:00) Tokelau Is.

export interface EditSelfUserOptions {
	avatar_id?: number | null;
	about?: string;
	artinfo?: string;
	timezone?: Timezones;
	receive_email_notifications?: boolean;
	comment_threshold?: number;
	default_image_size?: DefaultImageSize;
	/** between 25 and 250 */
	posts_per_page?: number;
	safe_mode: boolean;
	blacklisted_tags?: string | Array<string>;
	blacklist_users?: boolean;
	// advanced
	colored_usernames?: boolean;
	enable_keyboard_shortcuts?: boolean;
	enable_auto_complete?: boolean;
	enable_privacy_mode?: boolean;
	enable_post_statistics?: boolean;
	description_collapsed?: boolean;
	hide_comments?: boolean;
	disable_cropped_thumbnails?: boolean;
	show_own_hidden_comments?: boolean;
	enable_compact_uploader?: boolean;
	dmail_filter?: string;
	frequent_tags?: string;
	disable_responsive_mode?: boolean;
	custom_css_style?: string;
}
