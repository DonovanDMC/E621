import { createNewsUpdate, deleteNewsUpdate, editNewsUpdate, listNewsUpdates } from "../generated/sdk.js";
import NewsUpdate from "../models/NewsUpdate.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { CreateNewsUpdateData, EditNewsUpdateData, ListNewsUpdatesData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateNewsUpdateOptions extends TransformDataBodyToOptions<CreateNewsUpdateData> {}
/** @category Modules/Types */
export interface EditNewsUpdateOptions extends TransformDataBodyToOptions<EditNewsUpdateData> {}
/** @category Modules/Types */
export interface SearchNewsUpdatesOptions extends TransformDataQueryToOptions<ListNewsUpdatesData> {}

/** @category Modules */
export default class NewsUpdates extends Base {
    @OperationID("createNewsUpdate")
    async create(options: CreateNewsUpdateOptions): Promise<NewsUpdate> {
        return createNewsUpdate({
            client: this.client,
            body: prefixKeys(options, "news_update"),
        }).then(res => this._handleResponse(res, 201, true, NewsUpdate));
    }

    @OperationID("deleteNewsUpdate")
    async delete(id: number): Promise<null> {
        return deleteNewsUpdate({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editNewsUpdate")
    async edit(id: number, options: EditNewsUpdateOptions): Promise<null> {
        return editNewsUpdate({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "news_update"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("listNewsUpdates")
    async search(options?: SearchNewsUpdatesOptions): Promise<Array<NewsUpdate>> {
        return listNewsUpdates({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, NewsUpdate));
    }
}
