import Base from "./Base.js";
import {
    createWikiPage,
    deleteWikiPage,
    editWikiPage,
    getWikiPage,
    revertWikiPage,
    searchWikiPages
} from "../generated/sdk.js";
import type { CreateWikiPageData, EditWikiPageData, SearchWikiPagesData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import WikiPage from "../models/WikiPage.js";

/** @category Modules/Types */
export interface CreateWikiPageOptions extends TransformDataBodyToOptions<CreateWikiPageData> {}
/** @category Modules/Types */
export interface EditWikiPageOptions extends TransformDataBodyToOptions<EditWikiPageData> {}
/** @category Modules/Types */
export interface SearchWikiPagesOptions extends TransformDataQueryToOptions<SearchWikiPagesData> {}

/** @category Modules */
export default class WikiPages extends Base {
    @OperationID("createWikiPage")
    async create(options: CreateWikiPageOptions): Promise<WikiPage> {
        return createWikiPage({
            client: this.client,
            body:   prefixKeys(options, "wiki_page")
        }).then(res => this._handleResponse(res, 201, true, WikiPage));
    }

    @OperationID("deleteWikiPage")
    async delete(id: number): Promise<null> {
        return deleteWikiPage({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editWikiPage")
    async edit(id: number, options: EditWikiPageOptions): Promise<null> {
        return editWikiPage({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "wiki_page")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getWikiPage")
    async get(id: number): Promise<WikiPage | null> {
        return getWikiPage({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, WikiPage));
    }

    @OperationID("revertWikiPage")
    async revert(id: number, version_id: number): Promise<null> {
        return revertWikiPage({
            client: this.client,
            path:   { id },
            query:  { version_id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchWikiPages")
    async search(options?: SearchWikiPagesOptions): Promise<Array<WikiPage>> {
        return searchWikiPages({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, WikiPage));
    }
}
