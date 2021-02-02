# 621
A module for fetching posts from e621.
<hr>

## Usage
To use this module, simply make an instance of the main class and call one of the methods. I'll be listing parameters by providing the jsdoc.

```ts
// For regular javascript usage, switch out this for `const E621 = require("e621");
import E621 from "e621";
/**
 * Construct an instance of E621
 * @param {string} [apiKey] - an api key to use for requests 
 * @param {string[]} [blacklist=[]] - a list of tags to use to filter out posts 
 * @param {string }[userAgent] - A user agent to use for requests 
 * @param {boolean} [fixNullURLs=true] - If null urls should be converted to proper urls
 * @example new E621();
 * @example new E621("yourAPIKey");
 * @example new E621("yourAPIKey", ["watersports"]);
 * @example new E621("yourAPIKey", ["watersports"], "MyAwesomeProject/1.0.0");
 * @example new E621("yourAPIKey", ["watersports"], "MyAwesomeProject/1.0.0", false);
 */
const e = new E621();

/**
 * Get posts from e621
 * @param {string[]} [tags=[]] - The tags to fetch posts for, 40 max
 * @param {number} [limit=25] - The, maximum amount of posts to get, 320 max 
 * @param {number} [page=1] - The page of posts to get, see {@link https://e621.net/help/api#posts_list|E621 API Posts#List}
 * @returns {Promise<(Post | NullableURLPost)[]>}
 * @example getPosts()
 * @example getPosts(["male/male"]);
 * @example getPosts(["male/male"], 5);
 * @example getPosts(["male/male"], 5, 1);
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
