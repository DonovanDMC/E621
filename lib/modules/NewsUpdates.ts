import { newsUpdates_create, newsUpdates_destroy, newsUpdates_update, newsUpdates_index } from "../generated/sdk.js";
import NewsUpdate from "../models/NewsUpdate.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { NewsUpdatesCreateData, NewsUpdatesUpdateData, NewsUpdatesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateNewsUpdateOptions extends TransformDataBodyToOptions<NewsUpdatesCreateData> {}
/** @category Modules/Types */
export interface UpdateNewsUpdateOptions extends TransformDataBodyToOptions<NewsUpdatesUpdateData> {}
/** @category Modules/Types */
export interface SearchNewsUpdatesOptions extends TransformDataQueryToOptions<NewsUpdatesIndexData> {}

/** @category Modules */
export default class NewsUpdates extends Base {
    @OperationID("news_updates#create")
    async create(options: CreateNewsUpdateOptions): Promise<NewsUpdate> {
        return newsUpdates_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, NewsUpdate));
    }

    @OperationID("news_updates#destroy")
    async delete(id: number): Promise<null> {
        return newsUpdates_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("news_updates#index")
    async search(options?: SearchNewsUpdatesOptions): Promise<Array<NewsUpdate>> {
        return newsUpdates_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, NewsUpdate));
    }

    @OperationID("news_updates#update")
    async update(id: number, options: UpdateNewsUpdateOptions): Promise<null> {
        return newsUpdates_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
