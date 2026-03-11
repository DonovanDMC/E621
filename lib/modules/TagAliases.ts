import Base from "./Base.js";
import {
    approveTagAlias,
    createTagAlias,
    editTagAlias,
    getTagAlias,
    rejectTagAlias,
    searchTagAliases
} from "../generated/sdk.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import { type EditTagAliasData, type CreateTagAliasData, type SearchTagAliasesData } from "../generated/types.js";
import TagAlias from "../models/TagAlias.js";

/** @category Modules/Types */
export interface CreateTagAliasOptions extends TransformDataBodyToOptions<CreateTagAliasData> {}
/** @category Modules/Types */
export interface EditTagAliasOptions extends TransformDataBodyToOptions<EditTagAliasData> {}
/** @category Modules/Types */
export interface SearchTagAliasesOptions extends TransformDataQueryToOptions<SearchTagAliasesData> {}

/** @category Modules */
export default class TagAliases extends Base {
    @OperationID("approveTagAlias")
    async approve(id: number): Promise<null> {
        return approveTagAlias({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("createTagAlias")
    async create(options: CreateTagAliasOptions): Promise<unknown> {
        return createTagAlias({
            client: this.client,
            body:   prefixKeys(options, "tag_alias")
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("editTagAlias")
    async edit(id: number, options: EditTagAliasOptions): Promise<null> {
        return editTagAlias({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "tag_alias")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getTagAlias")
    async get(id: number): Promise<TagAlias | null> {
        return getTagAlias({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, TagAlias));
    }

    @OperationID("rejectTagAlias")
    async reject(id: number): Promise<null> {
        return rejectTagAlias({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchTagAliases")
    async search(options?: SearchTagAliasesOptions): Promise<Array<TagAlias>> {
        return searchTagAliases({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, TagAlias));
    }
}
