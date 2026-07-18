import { postFlags_clearNote, postFlags_create, postFlags_destroy, postFlags_show, postFlags_index } from "../generated/sdk.js";
import { type PostFlagsCreateData, type PostFlagsIndexData } from "../generated/types.js";
import PostFlag from "../models/PostFlag.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreatePostFlagOptions extends TransformDataBodyToOptions<PostFlagsCreateData> {}
/** @category Modules/Types */
export interface FlagPostOptions extends Omit<CreatePostFlagOptions, "post_id"> {}
/** @category Modules/Types */
export interface SearchPostFlagsOptions extends TransformDataQueryToOptions<PostFlagsIndexData> {}

/** @category Modules */
export default class PostFlags extends Base {
    @OperationID("post_flags#clear_note")
    async clearNote(id: number): Promise<PostFlag> {
        return postFlags_clearNote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, PostFlag));
    }

    @OperationID("post_flags#create")
    async create(options: CreatePostFlagOptions): Promise<PostFlag> {
        return postFlags_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, PostFlag));
    }

    @OperationID("post_flags#show")
    async get(id: number): Promise<PostFlag | null> {
        return postFlags_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, PostFlag));
    }

    @OperationID("post_flags#destroy")
    async resolve(post_id: number): Promise<null> {
        return postFlags_destroy({
            client: this.client,
            path: { id: post_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_flags#index")
    async search(options?: SearchPostFlagsOptions): Promise<Array<PostFlag>> {
        return postFlags_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostFlag));
    }
}
