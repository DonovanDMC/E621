import {
    wikiPages_create,
    wikiPages_destroy,
    wikiPages_update,
    wikiPages_show,
    wikiPages_revert,
    wikiPages_index,
} from "../generated/sdk.js";
import WikiPage from "../models/WikiPage.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { WikiPagesCreateData, WikiPagesUpdateData, WikiPagesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateWikiPageOptions extends TransformDataBodyToOptions<WikiPagesCreateData> {}
/** @category Modules/Types */
export interface UpdateWikiPageOptions extends TransformDataBodyToOptions<WikiPagesUpdateData> {}
/** @category Modules/Types */
export interface SearchWikiPagesOptions extends TransformDataQueryToOptions<WikiPagesIndexData> {}

/** @category Modules */
export default class WikiPages extends Base {
    static readonly moduleKey = "wikiPages" as const;
    @OperationID("wiki_pages#create")
    async create(options: CreateWikiPageOptions): Promise<WikiPage> {
        return wikiPages_create({
            client: this.client,
            body: prefixKeys(options, "wiki_page"),
        }).then(res => this._handleResponse(res, 201, true, WikiPage));
    }

    @OperationID("wiki_pages#destroy")
    async delete(id: number): Promise<null> {
        return wikiPages_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("wiki_pages#show")
    async get(id: number): Promise<WikiPage | null> {
        return wikiPages_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, WikiPage));
    }

    @OperationID("wiki_pages#revert")
    async revert(id: number, version_id: number): Promise<null> {
        return wikiPages_revert({
            client: this.client,
            path: { id },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("wiki_pages#index")
    async search(options?: SearchWikiPagesOptions): Promise<Array<WikiPage>> {
        return wikiPages_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, WikiPage));
    }

    @OperationID("wiki_pages#update")
    async update(id: number, options: UpdateWikiPageOptions): Promise<null> {
        return wikiPages_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "wiki_page"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
