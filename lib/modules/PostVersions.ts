import { postVersions_hide, postVersions_index, postVersions_undo, postVersions_unhide } from "../generated/sdk.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { PostVersionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchPostVersionsOptions extends TransformDataQueryToOptions<PostVersionsIndexData> {}

/** @category Modules */
export default class PostVersions extends Base {
    static readonly moduleKey = "postVersions" as const;
    @OperationID("post_versions#hide")
    async hide(id: number): Promise<string> {
        return postVersions_hide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("post_versions#index")
    async search(options?: SearchPostVersionsOptions): Promise<null> {
        return postVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_versions#undo")
    async undo(id: number): Promise<null> {
        return postVersions_undo({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_versions#unhide")
    async unhide(id: number): Promise<string> {
        return postVersions_unhide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 302, true));
    }
}
