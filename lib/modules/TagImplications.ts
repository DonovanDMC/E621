import {
    approveTagImplication,
    createTagImplication,
    editTagImplication,
    getTagImplication,
    rejectTagImplication,
    searchTagImplications,
} from "../generated/sdk.js";
import { type EditTagImplicationData, type CreateTagImplicationData, type SearchTagImplicationsData } from "../generated/types.js";
import TagImplication from "../models/TagImplication.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreateTagImplicationOptions extends TransformDataBodyToOptions<CreateTagImplicationData> {}
/** @category Modules/Types */
export interface EditTagImplicationOptions extends TransformDataBodyToOptions<EditTagImplicationData> {}
/** @category Modules/Types */
export interface SearchTagImplicationsOptions extends TransformDataQueryToOptions<SearchTagImplicationsData> {}

/** @category Modules */
export default class TagImplications extends Base {
    @OperationID("approveTagImplication")
    async approve(id: number): Promise<null> {
        return approveTagImplication({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("createTagImplication")
    async create(options: CreateTagImplicationOptions): Promise<unknown> {
        return createTagImplication({
            client: this.client,
            body: prefixKeys(options, "tag_implication"),
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("editTagImplication")
    async edit(id: number, options: EditTagImplicationOptions): Promise<null> {
        return editTagImplication({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "tag_implication"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getTagImplication")
    async get(id: number): Promise<TagImplication | null> {
        return getTagImplication({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, TagImplication));
    }

    @OperationID("rejectTagImplication")
    async reject(id: number): Promise<null> {
        return rejectTagImplication({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchTagImplications")
    async search(options?: SearchTagImplicationsOptions): Promise<Array<TagImplication>> {
        return searchTagImplications({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, TagImplication));
    }
}
