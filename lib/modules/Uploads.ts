import { getUpload, searchUploads, uploadPost } from "../generated/sdk.js";
import Upload from "../models/Upload.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchUploadsData, UploadPostData } from "../generated/types.js";
import type Post from "../models/Post.js";

/** @category Modules/Types */
export interface SearchUploadsOptions extends TransformDataQueryToOptions<SearchUploadsData> {}
/** @category Modules/Types */
export interface UploadPostOptions extends TransformDataBodyToOptions<UploadPostData> {}

/** @category Modules */
export default class Uploads extends Base {
    @OperationID("uploadPost")
    async create(options: UploadPostOptions): Promise<Post> {
        return uploadPost({
            client: this.client,
            body: prefixKeys(options, "upload"),
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return this.e621.posts.get(data.post_id)
                .then((post) => {
                    if (post === null) throw new Error(`Post not found after upload: ${data.post_id}`);
                    return post;
                });
        });
    }

    @OperationID("getUpload")
    async get(id: number): Promise<Upload | null> {
        return getUpload({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Upload));
    }

    @OperationID("searchUploads")
    async search(options?: SearchUploadsOptions): Promise<Array<Upload>> {
        return searchUploads({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Upload));
    }
}
