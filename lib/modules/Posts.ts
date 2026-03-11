import Base from "./Base.js";
import PostVotes from "./posts/Votes.js";
import PostFlag from "./posts/Flag.js";
import {
    aiCheckPost,
    copyNotesToPost,
    deletePost,
    expungePost,
    getPost,
    getPostInSequence,
    getRandomPost,
    listPostFavorites,
    markPostAsTranslated,
    movePostFavorites,
    regeneratePostThumbnails,
    regeneratePostVideos,
    revertPost,
    searchPosts,
    undeletePost,
    updatePostIqdb
} from "../generated/sdk.js";
import type {
    DeletePostData,
    GetPostInSequenceData,
    ListPostFavoritesData,
    MovePostFavoritesData,
    SearchPostsData
} from "../generated/types.js";
import {
    OperationID,
    type ExtractValue,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions
} from "../util.js";
import Post from "../models/Post.js";

/** @category Modules/Types */
export interface DeletePostOptions extends TransformDataBodyToOptions<DeletePostData> {}
/** @category Modules/Types */
export interface MovePostFavoritesOptions extends TransformDataBodyToOptions<MovePostFavoritesData> {}
/** @category Modules/Types */
export interface SearchPostsOptions extends TransformDataQueryToOptions<SearchPostsData> {}
/** @category Modules/Types */
export interface ListPostFavoritesOptions extends TransformDataQueryToOptions<ListPostFavoritesData> {}

/** @category Modules */
export default class Posts extends Base {
    flag = new PostFlag(this.e621, this.client);
    votes = new PostVotes(this.e621, this.client);

    @OperationID("aiCheckPost")
    async aiCheck(id: number): Promise<string> {
        const res = await aiCheckPost({
            client:   this.client,
            path:     { id },
            redirect: "manual"
        });
        return this._handleResponse(res, 302, true) as string;
    }

    @OperationID("copyNotesToPost")
    async copyNotes(id: number, other_post_id: number): Promise<null> {
        return copyNotesToPost({
            client: this.client,
            path:   { id },
            body:   { other_post_id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("deletePost")
    async delete(id: number, options: DeletePostOptions): Promise<unknown> {
        return deletePost({
            client: this.client,
            path:   { id },
            body:   options
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("expungePost")
    async expunge(id: number, reason: string): Promise<Post> {
        return expungePost({
            client: this.client,
            path:   { id },
            body:   { reason }
        }).then(res => {
            const data = this._handleResponse(res, 201, true);
            return new Post(this.e621, data.post);
        });
    }

    @OperationID("listPostFavorites")
    async favorites(id: number, options: ListPostFavoritesOptions): Promise<Array<Post>> {
        return listPostFavorites({
            client: this.client,
            path:   { id },
            query:  options
        }).then(res => this._handleResponse(res, 200, true, Post));
    }

    @OperationID("getPost")
    async get(id: number): Promise<Post | null> {
        return getPost({
            client: this.client,
            path:   { id }
        }).then(res => {
            const data = this._handleResponse(res, 200, false);
            return data === null ? null : new Post(this.e621, data.post);
        });
    }

    @OperationID("markPostAsTranslated")
    async markTranslated(id: number): Promise<Post> {
        return markPostAsTranslated({
            client: this.client,
            path:   { id }
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return new Post(this.e621, data.post);
        });
    }

    @OperationID("movePostFavorites")
    async moveFavorites(id: number, options: MovePostFavoritesOptions): Promise<unknown> {
        return movePostFavorites({
            client: this.client,
            path:   { id },
            body:   options
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("getRandomPost")
    async random(tags?: string): Promise<Post> {
        return getRandomPost({
            client: this.client,
            query:  { tags }
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return new Post(this.e621, data.post);
        });
    }

    @OperationID("regeneratePostThumbnails")
    async regenerateThumbnails(id: number): Promise<Post> {
        return regeneratePostThumbnails({
            client: this.client,
            path:   { id }
        }).then(res => {
            const data = this._handleResponse(res, 201, true);
            return new Post(this.e621, data.post);
        });
    }

    @OperationID("regeneratePostVideos")
    async regenerateVideos(id: number): Promise<null> {
        return regeneratePostVideos({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("revertPost")
    async revert(id: number, version_id: number): Promise<null> {
        return revertPost({
            client: this.client,
            path:   { id },
            query:  { version_id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchPosts")
    async search(options?: SearchPostsOptions): Promise<Array<Post>> {
        return searchPosts({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return data.posts.map(post => new Post(this.e621, post));
        });
    }

    @OperationID("getPostInSequence")
    async sequence(id: number, seq?: ExtractValue<"seq", GetPostInSequenceData>): Promise<Post> {
        return getPostInSequence({
            client: this.client,
            path:   { id },
            query:  { seq }
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return new Post(this.e621, data.post);
        });
    }

    @OperationID("undeletePost")
    async undelete(id: number): Promise<Post> {
        return undeletePost({
            client: this.client,
            path:   { id }
        }).then(res => {
            const data = this._handleResponse(res, 201, true);
            return new Post(this.e621, data.post);
        });
    }

    @OperationID("updatePostIqdb")
    async updateIqdb(id: number): Promise<Post> {
        return updatePostIqdb({
            client: this.client,
            path:   { id }
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return new Post(this.e621, data.post);
        });
    }
}
