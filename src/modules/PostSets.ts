import type E621 from "..";
import PostSet from "../structures/PostSet";
import type {
	PostSetProperties,
	SearchPostSetsOptions,
	CreatePostSetOptions,
	SearchPostSetsOrder,
	ModifyPostSetOptions
} from "../types";
import FormHelper from "../util/FormHelper";
import { APIError } from "../util/RequestHandler";

export default class PostSets {
	private readonly auth: string | null;
	private readonly main: E621;
	constructor(main: E621) {
		Object.defineProperties(this, {
			auth: {
				get(this: PostSets) {
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
	 * Get a post set by its id
	 *
	 * @param {(number | string)} id - The id of the post set to get
	 * @returns {Promise<(PostSet | null)>}
	 */
	async get(id: number | string) {
		const res = await this.main.request.get<PostSetProperties>(`/post_sets/${id}.json`).catch(err => {
			if (err instanceof APIError && err.statusCode === 404) return null;
			throw err;
		});
		return res === null ? null : new PostSet(this.main, res);
	}

	/**
	 * Get a post set by its name
	 *
	 * @param {string} name - The name of the post set to get
	 * @returns {Promise<(PostSet | null)>}
	 */
	async getByName(name: string) {
		return this.search({
			name,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Get a post set by its short name
	 *
	 * @param {string} name - The short name of the post set to get
	 * @returns {Promise<(PostSet | null)>}
	 */
	async getByShortName(shortname: string) {
		return this.search({
			shortname,
			limit: 1
		}).then(r => r.length === 0 ? null : r[0]);
	}

	/**
	 * Search for post sets
	 *
	 * @param {object} [options]
	 * @param {string} [options.name] - the name of the set
	 * @param {string} [options.shortname] - the shortname of the set
	 * @param {string} [options.username] - the creator of the set
	 * @param {SearchPostSetsOrder} [options.order] - the order of the results
	 * @param {(number |`${"" | "a" | "b"}${number}`)} [options.page] - page of results to get
	 * @param {number} [options.limit] - limit the maximum amount of results returned
	 * @returns {Promise<Array<PostSet>>}
	 */
	async search(options?: SearchPostSetsOptions) {
		options = options ?? {};
		const qs = new FormHelper();
		if (typeof options.name      === "string")    qs.add("search[name]", options.name);
		if (typeof options.shortname === "string")    qs.add("search[shortname]", options.shortname);
		if (typeof options.username  === "string")    qs.add("search[creator_name]", options.username);
		if (typeof options.order     === "string")    qs.add("search[order]", options.order);
		if (typeof options.page      !== "undefined") qs.add("page", options.page);
		if (typeof options.limit     === "number")    qs.add("limit", options.limit);
		const res = await this.main.request.get<Array<PostSetProperties> | { post_sets: []; }>(`/post_sets.json?${qs.build()}`);
		if (res && !Array.isArray(res) && "post_sets" in res) return [];
		return res!.map(info => new PostSet(this.main, info));
	}

	/**
	 * Create a post set
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} options.name - the name of the set
	 * @param {string} options.shortname - the shortname of the set
	 * @param {string} [options.description] - the description of the set
	 * @param {boolean} [options.public] - if the set is public
	 * @param {boolean} [options.transfer_on_deletion] - if deleted posts should be replaced with parents
	 * @returns {Promise<PostSet>}
	 */
	async create(options: CreatePostSetOptions) {
		this.main.request.authCheck.call(this, "PostSets#create");
		if (!options) throw new Error("options is required in PostSets#create");
		const qs = new FormHelper();
		if (typeof options.name               === "string")  qs.add("post_set[name]", options.name);
		if (typeof options.shortname          === "string")  qs.add("post_set[shortname]", options.shortname);
		if (typeof options.description        === "string")  qs.add("post_set[description]", options.description);
		if (typeof options.public             === "boolean") qs.add("post_set[is_public]", options.public);
		if (typeof options.transfer_on_deletion === "boolean") qs.add("post_set[transfer_on_delete]", options.transfer_on_deletion);
		const res = await this.main.request.post<PostSetProperties>("/post_sets.json", qs.build());
		return new PostSet(this.main, res!);
	}

	/**
	 * modify a set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the set to edit
	 * @param {object} options
	 * @param {string} [options.name] - the name of the set
	 * @param {string} [options.shortname] - the short name of the set
	 * @param {string} [options.description] - the description of the set
	 * @param {boolean} [options.active] - if the set is public
	 * @param {boolean} [options.transfer_on_deletion] - if deleted posts should be replaced with parents
	 * @returns {Promise<PostSet>}
	 */
	async modify(id: number, options: ModifyPostSetOptions) {
		this.main.request.authCheck.call(this, "PostSet#modify");
		if (!options) throw new Error("options is required in PostSets#modify");
		const qs = new FormHelper();
		if (typeof options.name               === "string")  qs.add("post_set[name]", options.name);
		if (typeof options.shortname          === "string")  qs.add("post_set[shortname]", options.shortname);
		if (typeof options.description        === "string")  qs.add("post_set[description]", options.description);
		if (typeof options.public             === "boolean") qs.add("post_set[is_public]", options.public);
		if (typeof options.transfer_on_deletion === "boolean") qs.add("post_set[transfer_on_delete]", options.transfer_on_deletion);
		const res = await this.main.request.patch<PostSetProperties>(`/post_sets/${id}.json`, qs.build());
		return new PostSet(this.main, res!);
	}

	/**
	 * Delete a set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the set to delete
	 * @returns {Promise<null>}
	 */
	async delete(id: number) {
		this.main.request.authCheck.call(this, "PostSets#delete");
		return this.main.request.delete<null>(`/post_sets/${id}.json`);
	}

	/**
	 * Add a post (or multiple) to a set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the set to add to
	 * @param {(Array<number> | number)} posts - the post id (or multiple) to add to the set
	 * @returns {Promise<PostSet>}
	 */
	async addPost(id: number, posts: Array<number> | number) {
		const qs = new FormHelper();
		(Array.isArray(posts) ? posts : [posts]).map(p => qs.add("post_ids[]", p));
		const res = await this.main.request.post<PostSetProperties>(`/post_sets/${id}/add_posts.json`, qs.build());
		return new PostSet(this.main, res!);
	}
	get addPosts() { return this.addPost.bind(this); }

	/**
	 * Remove a post (or multiple) from a set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the set to remove from
	 * @param {(Array<number> | number)} posts - the post id (or multiple) to remove from the set
	 * @returns {Promise<PostSet>}
	 */
	async removePost(id: number, posts: Array<number> | number) {
		const qs = new FormHelper();
		(Array.isArray(posts) ? posts : [posts]).map(p => qs.add("post_ids[]", p));
		const res = await this.main.request.post<PostSetProperties>(`/post_sets/${id}/remove_posts.json`, qs.build());
		return new PostSet(this.main, res!);
	}
	get removePosts() { return this.removePost.bind(this); }
}
