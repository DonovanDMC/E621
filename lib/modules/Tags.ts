import Base from "./Base.js";
import {
    deleteTag,
    editTag,
    getTag,
    previewTags,
    searchTags
} from "../generated/sdk.js";
import type { SearchTagsData, EditTagData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import Tag from "../models/Tag.js";
import TagPreview from "../models/TagPreview.js";

/** @category Modules/Types */
export interface EditTagOptions extends TransformDataBodyToOptions<EditTagData> {}
/** @category Modules/Types */
export interface SearchTagsOptions extends TransformDataQueryToOptions<SearchTagsData> {}

/** @category Modules */
export default class Tags extends Base {
    @OperationID("deleteTag")
    async delete(id: number): Promise<null> {
        return deleteTag({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editTag")
    async edit(id: number, options: EditTagOptions): Promise<null> {
        return editTag({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "tag")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getTag")
    async get(id: number): Promise<Tag | null> {
        return getTag({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, Tag));
    }

    @OperationID("previewTags")
    async preview(tags: string): Promise<Array<TagPreview>> {
        return previewTags({
            client: this.client,
            body:   { tags }
        }).then(res => this._handleResponse(res, 200, true, TagPreview));
    }

    @OperationID("searchTags")
    async search(options?: SearchTagsOptions): Promise<Array<Tag>> {
        return searchTags({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, Tag));
    }
}
