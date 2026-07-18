import { uploads_show, uploads_index, uploads_create } from "../generated/sdk.js";
import Upload from "../models/Upload.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { UploadsIndexData, UploadsCreateData } from "../generated/types.js";
import type Post from "../models/Post.js";

/** @category Modules/Types */
export interface SearchUploadsOptions extends TransformDataQueryToOptions<UploadsIndexData> {}
/** @category Modules/Types */
export interface UploadPostOptions extends TransformDataBodyToOptions<UploadsCreateData> {}

/** @category Modules */
export default class Uploads extends Base {
    static readonly moduleKey = "uploads" as const;
    @OperationID("uploads#create")
    async create(options: UploadPostOptions): Promise<Post> {
        return uploads_create({
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

    @OperationID("uploads#show")
    async get(id: number): Promise<Upload | null> {
        return uploads_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Upload));
    }

    @OperationID("uploads#index")
    async search(options?: SearchUploadsOptions): Promise<Array<Upload>> {
        return uploads_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Upload));
    }
}
