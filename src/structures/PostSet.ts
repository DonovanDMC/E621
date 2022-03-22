import type Post from "./Post";
import type User from "./User";
import type { PostSetProperties, ModifyPostSetOptions } from "../types";
import type E621 from "..";

export default class PostSet implements PostSetProperties {
	private main: E621;
	id: number;
	name: string;
	shortname: string;
	description: string;
	is_public: boolean;
	transfer_on_delete: boolean;
	creator_id: number;
	post_ids: Array<number>;
	post_count: number;
	created_at: string;
	updated_at: string;
	constructor(main: E621, info: PostSetProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value: main,
			configurable: false,
			enumerable: false,
			writable: false
		});
	}

	/**
	 * Get the post objects for the posts in this set
	 *
	 * @returns {Promise<Array<Post>>}
	 */
	async getPosts() { return this.main.posts.search.call(this.main.posts, { tags: this.post_ids.map(p => `id:${p}`) }); }

	/**
	 * Get the user object of the creator of this set
	 *
	 * @returns {Promise<User | null>}
	 */
	async getCreator() { return this.main.users.get.call(this.main.users, this.creator_id); }

	/**
	 * Add a post to this set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to add
	 * @returns {Promise<PostSet>}
	 */
	async addPost(id: number) {
		this.main.request.authCheck("PostSet#addPost");
		return this.main.postSets.addPost.call(this.main.posts, this.id, id);
	}

	/**
	 * Remove a post from this set
	 *
	 * * Requires Authentication
	 *
	 * @param {number} id - the id of the post to remove
	 * @returns {Promise<PostSet>}
	 */
	async removePost(id: number) {
		this.main.request.authCheck("PostSet#removePost");
		return this.main.postSets.removePost.call(this.main.postSets, this.id, id);
	}

	/**
	 * modify this set
	 *
	 * * Requires Authentication
	 *
	 * @param {object} options
	 * @param {string} [options.name] - the name of the set
	 * @param {string} [options.shortname] - the short name of the set
	 * @param {string} [options.escription] - the description of the set
	 * @param {boolean} [options.active] - if the set is public
	 * @param {boolean} [options.transfer_on_deletion] - if deleted posts should be replaced with parents
	 * @returns {Promise<PostSet>}
	 */
	async modify(options: ModifyPostSetOptions) {
		this.main.request.authCheck("PostSet#modify");
		if (!options) throw new Error("options is required in PostSet#modify");
		return this.main.postSets.modify.call(this.main.postSets, this.id, options);
	}

	/**
	 * Delete this set
	 *
	 * * Requires Authentication
	 *
	 * @returns {Promise<null>}
	 */
	async delete() {
		this.main.request.authCheck("PostSet#delete");
		return this.main.postSets.delete.call(this.main.postSets, this.id);
	}
}
