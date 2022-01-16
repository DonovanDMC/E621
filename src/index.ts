import type { Options, InstanceOptions, ConstructedOptions } from "./types";
import RequestHandler from "./util/RequestHandler";
// Modules
import Artists from "./modules/Artists";
import Notes from "./modules/Notes";
import Pools from "./modules/Pools";
import Posts from "./modules/Posts";
import PostSets from "./modules/PostSets";
import Tags from "./modules/Tags";
import UserFeedback from "./modules/UserFeedback";
import Users from "./modules/Users";
import WikiPages from "./modules/WikiPages";
// Structures
import Artist from "./structures/Artist";
import ArtistHistory from "./structures/ArtistHistory";
import Note from "./structures/Note";
import NoteHistory from "./structures/NoteHistory";
import AuthenticatedUser from "./structures/AuthenticatedUser";
import Pool from "./structures/Pool";
import PoolHistory from "./structures/PoolHistory";
import Post from "./structures/Post";
import PostApproval from "./structures/PostApproval";
import PostHistory from "./structures/PostHistory";
import PostSet from "./structures/PostSet";
import Tag from "./structures/Tag";
import TagHistory from "./structures/TagHistory";
import User from "./structures/User";
import WikiPage from "./structures/WikiPage";
import WikiPageHistory from "./structures/WikiPageHistory";

import pkg from "../package.json";

// note for future reference (browser compatibility?)
// POST with "_method=*" can be used in place of PUT/PATCH/DELETE
export default class E621 {
	static YiffyAPI: typeof YiffyAPI;
	static Dev: typeof Dev;
	static Custom: typeof Custom;
	POST_LIMIT_PER_REQUEST = 320;
	request = new RequestHandler(this);
	artists = new Artists(this);
	notes = new Notes(this);
	pools = new Pools(this);
	posts = new Posts(this);
	postSets = new PostSets(this);
	tags = new Tags(this);
	userFeedback = new UserFeedback(this);
	users = new Users(this);
	wikiPages = new WikiPages(this);
	private readonly auth: string | null;
	readonly options: ConstructedOptions;
	constructor(options?: Options) {
		if (!options) options = {};

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
					authUser: options.authUser ?? null,
					authKey: options.authKey ?? null,
					userAgent: options.userAgent ?? `E621/${pkg.version} (https://github.com/DonovanDMC/E621${!options.authUser ? "" : `; "${options.authUser}"`})`,
					requestTimeout: options.requestTimeout ?? 30
				},
				configurable: false,
				enumerable: false,
				writable: false
			}
		});
		this.setInstance({});
	}

	setInstance(opt: InstanceOptions) {
		if (!opt.host) opt.host = "e621.net";
		opt.ssl = opt.ssl ?? ["e621.net", "yiff.rest"].includes(opt.host);
		if (!opt.port) opt.port = opt.ssl ? 443 : 80;
		if (!opt.imageReconstructionType) {
			switch (opt.host) {
				case "e621.net": opt.imageReconstructionType = "e621"; break;
				case "yiff.rest": opt.imageReconstructionType = "yiffy"; break;
				case "e621.local": case "e621ng.local": case "localhost": opt.imageReconstructionType = "dev"; break;
				default: {
					opt.imageReconstructionType = null;
					if (!opt.reconstructStaticURL) process.emitWarning("You specified a host that wasn't in our known list (e621.net, yiff.rest, e621.local) and didn't also specify imageReconstructionType or reconstructStaticURL. This WILL cause an error if we see any null file urls.");
				}
			}
		}

		Object.assign(this.options, {
			instanceHost: opt.host,
			instancePort: opt.port,
			instanceSSL: opt.ssl,
			reconstructStaticURL: opt.reconstructStaticURL || null,
			imageReconstructionType: opt.imageReconstructionType || "hierarchy"
		});
	}
}

class YiffyAPI extends E621 {
	constructor(options: Options) {
		super(options);
		this.setInstance({
			host: "yiff.rest",
			port: 443,
			ssl: true
		});
	}
}

class Dev extends E621 {
	constructor(options: Options, ssl = false) {
		super(options);
		this.setInstance({
			host: "localhost",
			port: 3000,
			ssl
		});
	}
}

class Custom extends E621 {
	constructor(options: Options, instanceOptions: InstanceOptions) {
		super(options);
		this.setInstance(instanceOptions);
	}
}

// due to extending the main class, neither of these (E621 class & sub-class) can happen "first", when both need to
E621.YiffyAPI = YiffyAPI;
E621.Dev = Dev;
E621.Custom = Custom;

export * from "./types";
export { APIError } from "./util/RequestHandler";
export {
	Artist,
	ArtistHistory,
	Note,
	NoteHistory,
	AuthenticatedUser,
	Pool,
	PoolHistory,
	Post,
	PostApproval,
	PostHistory,
	PostSet,
	Tag,
	TagHistory,
	User,
	WikiPage,
	WikiPageHistory,
	YiffyAPI,
	Dev,
	Custom
};
