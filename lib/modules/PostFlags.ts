import Base from "./Base.js";
import { clearPostFlagNote, createPostFlag, getPostFlag, searchPostFlags } from "../generated/sdk.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import { type CreatePostFlagData, type SearchPostFlagsData } from "../generated/types.js";
import PostFlag from "../models/PostFlag.js";

/** @category Modules/Types */
export interface CreatePostFlagOptions extends TransformDataBodyToOptions<CreatePostFlagData> {}
/** @category Modules/Types */
export interface SearchPostFlagsOptions extends TransformDataQueryToOptions<SearchPostFlagsData> {}

/** @category Modules */
export default class PostFlags extends Base {
    @OperationID("clearPostFlagNote")
    async clearNote(id: number): Promise<PostFlag> {
        return clearPostFlagNote({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, true, PostFlag));
    }

    @OperationID("createPostFlag")
    async create(options: CreatePostFlagOptions): Promise<PostFlag> {
        return createPostFlag({
            client: this.client,
            body:   prefixKeys(options, "post_flag")
        }).then(res => this._handleResponse(res, 201, true, PostFlag));
    }

    @OperationID("getPostFlag")
    async get(id: number): Promise<PostFlag | null> {
        return getPostFlag({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, PostFlag));
    }

    @OperationID("searchPostFlags")
    async search(options?: SearchPostFlagsOptions): Promise<Array<PostFlag>> {
        return searchPostFlags({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, PostFlag));
    }
}
