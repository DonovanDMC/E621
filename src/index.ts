import type { Options, InstanceOptions } from "./types";
import RequestHandler from "./util/RequestHandler";
import Posts from "./modules/Posts";
import UserFeedback from "./modules/UserFeedback";
import Users from "./modules/Users";
import PostSets from "./modules/PostSets";
import Pools from "./modules/Pools";
import pkg from "../package.json";

// note for future reference (browser compatibility?)
// POST with "_method=*" can be used in place of PUT/PATCH/DELETE
export default class E621 {
	request = new RequestHandler(this);
	postSets = new PostSets(this);
	pools = new Pools(this);
	posts = new Posts(this);
	userFeedback = new UserFeedback(this);
	users = new Users(this);
	private readonly auth: string | null;
	readonly options: InstanceOptions;
	constructor(options?: Options) {
		if (!options) options = {};

		if (!options.instanceHost) options.instanceHost = "e621.net";
		options.instanceSSL = options.instanceSSL ?? options.instanceHost === "e621.net";
		if (!options.instancePort) options.instancePort = options.instanceSSL ? 443 : 80;

		if (!options.staticHost) options.staticHost = options.instanceHost === "e621.net" ? "static1.e621.net" : options.instanceHost;
		options.staticSSL = options.staticSSL ?? (/^static\d+\.e621\.net/.test(options.staticHost) || options.instanceHost === "e621.net" || options.instanceSSL);
		if (!options.staticPort) options.staticPort = options.staticSSL ? 443 : options.instancePort;

		Object.defineProperties(this, {
			auth: {
				get(this: E621) {
					return !this.options.authUser || !this.options.authKey ? null : `Basic ${Buffer.from(`${this.options.authUser}:${this.options.authKey}`).toString("base64")}`;
				},
				configurable: false,
				enumerable: false
			},
			options: {
				value: {
					instanceHost: options.instanceHost,
					instancePort: options.instancePort,
					instanceSSL: options.instanceSSL,
					staticHost: options.staticHost,
					staticPort: options.staticPort,
					staticSSL: options.staticSSL,
					authUser: options.authUser ?? null,
					authKey: options.authKey ?? null,
					imageReconstructionType: options.imageReconstructionType || "hierarchy",
					userAgent: options.userAgent ?? `E621/${pkg.version} (https://github.com/DonovanDMC/E621${!options.authUser ? "" : `; "${options.authUser}"`})`
				},
				configurable: false,
				enumerable: false,
				writable: false
			}
		});
	}
}
export * from "./types";
