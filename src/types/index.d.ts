export interface Options {
	/**
	 * If the instance you are targeting supports ssl
	 *
	 * Default: true if `instanceHost` is "e621.net", false otherwise
	 */
	instanceSSL?: boolean;
	/**
	 * The port of the instance you are targeting
	 *
	 * Default: 443 if `instanceSSL` is true, 80 otherwise
	 */
	instancePort?: number;
	/**
	 * The host of the instance you are targeting
	 *
	 * Default: e621.net
	 */
	instanceHost?: string;
	/**
	 * If the static server of the instance you are targeting supports ssl
	 *
	 * Default: true if `staticHost` is "static*.e621.net", or `instanceHost` is "e621.net", same as `instanceSSL` otherwise
	 */
	staticSSL?: boolean;
	/**
	 * The port of static server of the instance you are targeting
	 *
	 * Default: 443 if `staticSSL` is true, same as `instancePort` otherwise
	 */
	staticPort?: number;
	/**
	 * The host of the instance you are targeting
	 *
	 * Default: static1.e621.net if `instanceHost` is "e621.net", same as `instanceHost` otherwise
	 */
	staticHost?: string;
	/**
	 * The uername of the user you want to authenticate with
	 *
	 * Default: none
	 */
	authUser?: string;
	/**
	 * The api key you want to authenticate with (Account -> Manage API Access)
	 *
	 * Default: none
	 */
	authKey?: string;
	/**
	 * The method to use for image reconstructon (e621.net uses "hierarchy", default instances of e621ng use "root")
	 *
	 * * `hierarchy` - images sorted into sub folders based on md5
	 *
	 * * `root` - everything in the same top directory)
	 *
	 * Default: hierarchy
	 */
	imageReconstructionType?: "hierarchy" | "root";
	/**
	 * The user agent to use for requests
	 *
	 * Default (Without Auth): E621/VERSION (https://github.com/DonovanDMC/E621)
	 *
	 * Default (With Auth): E621/VERSION (https://github.com/DonovanDMC/E621; "{authUser}")
	 */
	userAgent?: string;
	/**
	 * The number of seconds before a request times out
	 *
	 * Default: 30
	 */
	requestTimeout?: number;
}

export interface InstanceOptions {
	instanceSSL: boolean;
	instancePort: number;
	instanceHost: string;
	staticSSL: boolean;
	staticPort: number;
	staticHost: string;
	authUser: string | null;
	authKey: string | null;
	imageReconstructionType: "hierarchy" | "root";
	userAgent: string;
	requestTimeout: number;
}

export interface GenericSearchOptions {
	limit?: number;
	page?: number;
}

export * from "./pools";
export * from "./post_sets";
export * from "./posts";
export * from "./user_feedback";
export * from "./users";
