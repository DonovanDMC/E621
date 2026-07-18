import {
    tagImplications_approve,
    tagImplicationRequests_create,
    tagImplications_update,
    tagImplications_show,
    tagImplications_destroy,
    tagImplications_index,
} from "../generated/sdk.js";
import { type TagImplicationsUpdateData, type TagImplicationRequestsCreateData, type TagImplicationsIndexData } from "../generated/types.js";
import TagImplication from "../models/TagImplication.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreateTagImplicationOptions extends TransformDataBodyToOptions<TagImplicationRequestsCreateData> {}
/** @category Modules/Types */
export interface UpdateTagImplicationOptions extends TransformDataBodyToOptions<TagImplicationsUpdateData> {}
/** @category Modules/Types */
export interface SearchTagImplicationsOptions extends TransformDataQueryToOptions<TagImplicationsIndexData> {}

/** @category Modules */
export default class TagImplications extends Base {
    @OperationID("tag_implications#approve")
    async approve(id: number): Promise<null> {
        return tagImplications_approve({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("tag_implication_requests#create")
    async create(options: CreateTagImplicationOptions): Promise<unknown> {
        return tagImplicationRequests_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("tag_implications#show")
    async get(id: number): Promise<TagImplication | null> {
        return tagImplications_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, TagImplication));
    }

    @OperationID("tag_implications#destroy")
    async reject(id: number): Promise<null> {
        return tagImplications_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("tag_implications#index")
    async search(options?: SearchTagImplicationsOptions): Promise<Array<TagImplication>> {
        return tagImplications_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, TagImplication));
    }

    @OperationID("tag_implications#update")
    async update(id: number, options: UpdateTagImplicationOptions): Promise<null> {
        return tagImplications_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
