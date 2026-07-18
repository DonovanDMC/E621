import {
    tagAliases_approve,
    tagAliasRequests_create,
    tagAliases_update,
    tagAliases_show,
    tagAliases_destroy,
    tagAliases_index,
} from "../generated/sdk.js";
import { type TagAliasesUpdateData, type TagAliasRequestsCreateData, type TagAliasesIndexData } from "../generated/types.js";
import TagAlias from "../models/TagAlias.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreateTagAliasOptions extends TransformDataBodyToOptions<TagAliasRequestsCreateData> {}
/** @category Modules/Types */
export interface UpdateTagAliasOptions extends TransformDataBodyToOptions<TagAliasesUpdateData> {}
/** @category Modules/Types */
export interface SearchTagAliasesOptions extends TransformDataQueryToOptions<TagAliasesIndexData> {}

/** @category Modules */
export default class TagAliases extends Base {
    @OperationID("tag_aliases#approve")
    async approve(id: number): Promise<null> {
        return tagAliases_approve({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("tag_alias_requests#create")
    async create(options: CreateTagAliasOptions): Promise<unknown> {
        return tagAliasRequests_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("tag_aliases#show")
    async get(id: number): Promise<TagAlias | null> {
        return tagAliases_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, TagAlias));
    }

    @OperationID("tag_aliases#destroy")
    async reject(id: number): Promise<null> {
        return tagAliases_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("tag_aliases#index")
    async search(options?: SearchTagAliasesOptions): Promise<Array<TagAlias>> {
        return tagAliases_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, TagAlias));
    }

    @OperationID("tag_aliases#update")
    async update(id: number, options: UpdateTagAliasOptions): Promise<null> {
        return tagAliases_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
