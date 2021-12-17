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
	 * Override our default url reconstruction when we see a null file url
	 *
	 * Default (e621.net): https://static1.e621.net/data/(preview/|sample/)MD5[0,2]/MD5[2,4]/MD5.EXT
	 *
	 * Default (yiff.rest): https://v3.yiff.media/(preview/|sample/)MD5[0,2]/MD5[2,4]/MD5.EXT
	 *
	 * Default (e621.local): http://e621.local/data/(preview/|sample/)MD5.EXT
	 *
	 * If you use a host that is not supported, and do not implement this, or set a construction type, an error will be thrown.
	 *
	 * @param {string} md5 - the md5 of the image
	 * @param {("original" | "preview" | "sample")} type - the type of url being constructed
	 * @param {string} ext - the extension of the file
	 */
	reconstructStaticURL?(this: void, md5: string, type: "original" | "preview" | "sample", ext: string): string;
	/**
	 * The method to use for image reconstructon (if you are not using E621, YiffyAPI, or e621ng, you MUST override the reconstructStaticURL function, as the static urls are hardcoded for these)
	 *
	 * Default: based on `instanceHost` - e621.net = e621 | yiff.rest = yiffy | e621.local = dev | other = null
	 */
	imageReconstructionType?: "e621" | "yiffy" | "dev" | null;
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
	authUser: string | null;
	authKey: string | null;
	reconstructStaticURL: ((this: void, md5: string, type: "original" | "preview" | "sample", ext: string) => string) | null;
	imageReconstructionType: "e621" | "yiffy" | "dev" | null;
	userAgent: string;
	requestTimeout: number;
}

export interface GenericSearchOptions {
	limit?: number;
	page?: number | `${"a" | "b" | ""}${number}`;
}

export * from "./artists";
export * from "./notes";
export * from "./pools";
export * from "./post_sets";
export * from "./posts";
export * from "./tags";
export * from "./user_feedback";
export * from "./users";
export * from "./wiki_pages";
