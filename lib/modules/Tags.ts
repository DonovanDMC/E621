import {
    tags_destroy,
    tags_update,
    tags_show,
    tags_preview,
    tags_index,
} from "../generated/sdk.js";
import Tag from "../models/Tag.js";
import TagPreview from "../models/TagPreview.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { TagsIndexData, TagsUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface UpdateTagOptions extends TransformDataBodyToOptions<TagsUpdateData> {}
/** @category Modules/Types */
export interface SearchTagsOptions extends TransformDataQueryToOptions<TagsIndexData> {}

/** @category Modules */
export default class Tags extends Base {
    static readonly moduleKey = "tags" as const;
    @OperationID("tags#destroy")
    async delete(id: number): Promise<null> {
        return tags_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("tags#show")
    async get(id: number): Promise<Tag | null> {
        return tags_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Tag));
    }

    @OperationID("tags#preview")
    async preview(tags: string): Promise<Array<TagPreview>> {
        return tags_preview({
            client: this.client,
            body: { tags },
        }).then(res => this._handleResponse(res, 200, true, TagPreview));
    }

    @OperationID("tags#index")
    async search(options?: SearchTagsOptions): Promise<Array<Tag>> {
        return tags_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Tag));
    }

    @OperationID("tags#update")
    async update(id: number, options: UpdateTagOptions): Promise<null> {
        return tags_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "tag"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
