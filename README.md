# 621
A module for fetching posts from e621.

[![](https://nodei.co/npm/e621.png)](https://npm.im/e621)
<hr>

## Usage
To use this module, simply make an instance of the main class and call one of the methods. I'll be listing parameters by providing the jsdoc.

## Get Posts
```ts
// For regular javascript usage, switch out this for `const E621 = require("e621");
import E621 from "e621";
/**
 * Construct an instance of E621
 *
 * @param {string} [username] - your e621 username to use for requests
 * @param {string} [apiKey] - an api key to use for requests
 * @param {string[]} [blacklist=[]] - a list of tags to use to filter out posts
 * @param {string }[userAgent] - A user agent to use for requests
 * @param {boolean} [fixNullURLs=true] - If null urls should be converted to proper urls
 * @param {string} [baseDomain=this.baseDomain] - The domain to use for api requests
 * @param {boolean} [setHost=false] - If we should set the Host header on requests to e621.net (useful for proxies).
 * @example new E621();
 * @example new E621("YourUsername", "YourAPIKey");
 * @example new E621("YourUsername", "YourAPIKey", ["male/male"]);
 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0");
 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0", false);
 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0", false, "mye621.local");
 * @example new E621("YourUsername", "YourAPIKey", ["male/male"], "MyAwesomeProject/1.0.0", false, "mye621.local", false);
 */
const e = new E621();

/**
 * Get posts from e621
 * @param {string[]} [tags=[]] - The tags to fetch posts for, 40 max
 * @param {number} [limit=25] - The, maximum amount of posts to get, 320 max 
 * @param {number} [page=1] - The page of posts to get, see {@link https://e621.net/help/api#posts_list|E621 API Posts#List}
 * @returns {Promise<(Post | NullableURLPost)[]>}
 * @example getPosts()
 * @example getPosts("male bulge");
 * @example getPosts(["male", "bulge"]);
 * @example getPosts(["male", "bulge"], 5);
 * @example getPosts(["male", "bulge"], 5, 1);
 */
e.getPosts(["male/male"]).then(console.log) // array of posts, see Post Structure

/**
 * Get a specifc post from e621, by id
 * @param {number} id - The id of the post to get
 * @returns {Promise<(Post | NullableURLPost)>}
 * @example getPostById(1391357)
 */
e.getPostById(1391357).then(console.log) // single post, see Post Structure

/**
 * Get a specifc post from e621, by id
 * @param {number} id - The id of the post to get
 * @returns {Promise<(Post | NullableURLPost)>}
 * @example getPostById(1391357)
 */
e.getPostByMD5("6fd0b0f2237543bfeee5ca9318a97b46").then(console.log) // single post, see Post Structure
```

## Edit Post
This is mostly untested, but should work
```ts
import E621 from "e621";
// both username & apikey are required for edits!
const e = new E621("YourUsername", "YourAPIKey");

// they all return a post, see Post Structure
// if no reason is provided, "Edit via https://npm.im/e621" will be used.

// add tag
e.editPost(1022094, "Some Reason Here", "added_tag");

// remove tag (notice the minus)
e.editPost(1022094, "Some Reason Here", "-remove_tag");

// the undefined parts are REQUIRED if you are not using the previous parameters

// add source
e.editPost(1022094, "Some Reason Here", undefined, "https://some.added/source");

// remove source (notice the minus)
e.editPost(1022094, "Some Reason Here", undefined, "-https://some.removed/source");

// update parent id
e.editPost(1022094, "Some Reason Here", undefined, undefined, 1097929);

// set description
e.editPost(1022094, "Some Reason Here", undefined, undefined, undefined, "My Amazing Post Description");

// set rating - s: safe, q: questionable, e: explicit
e.editPost(1022094, "Some Reason Here", undefined, undefined, undefined, undefined, "e");

// set rating locked
e.editPost(1022094, "Some Reason Here", undefined, undefined, undefined, undefined, undefined, true);

// set note locked
e.editPost(1022094, "Some Reason Here", undefined, undefined, undefined, undefined, undefined, undefined, false);

// set has embedded notes
e.editPost(1022094, "Some Reason Here", undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
```

## Create Post
This is mostly untested, but should work
```ts
import E621 from "e621";
// both username & apikey are required for uploading!
const e = new E621("YourUsername", "YourAPIKey");

// they all return a post, see Post Structure

// minimum requirements: fileURL, tags, rating
e.createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e");

// sources
e.createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", 
["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"]);

// description
e.createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here");

// parent id
e.createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here", 1234);

// referer (?)
e.createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here", 1234, "https://npm.im/e621");

// md5 confirmation
e.createPost("https://pbs.twimg.com/media/EbOwnXpXkAIC5ZX.jpg:orig", ["gaokun", "bulge", "penis_outline" (...)], "e", ["https://twitter.com/Gaokunx3", "https://twitter.com/Gaokunx3/status/1275559030522556417"], "Some Description Stuff Here", 1234, "https://npm.im/e621", "abcdefghijklmnopqrstuvwxyz123456");
```

## Post Structure
Through the e621 api, some posts can have null urls. By default, we fix this by replacing it with a proper url. You can turn this off via an option in the constructor.
```ts
// If you haven't used typescript, pretend this is just an object, and the values after
// the colons are the type of what should be there

// Post is just a version without the null value on file.url, preview.url, and sample.url
interface NullableURLPost {
	id: string;
	created_at: string;
	updated_at: string;
	file: {
		width: number;
		height: number;
		ext: string;
		md5: string;
		url: string | null;
	};
	preview: {
		width: number;
		height: number;
		url: string | null;
	};
	sample: {
		has: boolean;
		height: number;
		width: number;
		url: string | null;
		alternates: {}; // @TODO
	};
	score: {
		up: number;
		down: number;
		total: number;
	};
	// a record is just a key-value pair, every key here is an array of strings
	tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", string[]>;
	locked_tags: string[];
	change_seq: number;
	flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
	rating: "s" | "q" | "e";
	fav_count: number;
	sources: string[];
	pools: number[];
	relationships: {
		parent_id: number | null;
		has_children: boolean;
		has_active_children: boolean;
		children: number[]
	};
	approver_id: number | null;
	uploader_id: number | null;
	description: string;
	comment_count: number;
	is_favorited: boolean;
	has_notes: boolean;
	duration: number | null;
}
```
