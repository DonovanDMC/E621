import {
    savedSearches_badge,
    savedSearches_create,
    savedSearches_destroy,
    savedSearches_index,
    savedSearches_markAllSeen,
    savedSearches_show,
    savedSearches_update,
} from "../generated/sdk.js";
import SavedSearch from "../models/SavedSearch.js";
import { GetResponse, OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { SavedSearchesBadgeResponses, SavedSearchesCreateData, SavedSearchesUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateSavedSearchOptions extends TransformDataBodyToOptions<SavedSearchesCreateData> {}
/** @category Modules/Types */
export interface UpdateSavedSearchOptions extends TransformDataBodyToOptions<SavedSearchesUpdateData> {}
/** @category Modules/Types */
export interface SavedSearchesBadgeResponse extends GetResponse<SavedSearchesBadgeResponses, 200> {}

/** @category Modules */
export default class SavedSearches extends Base {
    static readonly moduleKey = "savedSearches" as const;
    @OperationID("saved_searches#badge")
    async badge(): Promise<SavedSearchesBadgeResponse> {
        return savedSearches_badge({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("saved_searches#create")
    async create(options: CreateSavedSearchOptions): Promise<SavedSearch> {
        return savedSearches_create({
            client: this.client,
            body: prefixKeys(options, "saved_search"),
        }).then(res => this._handleResponse(res, 200, true, SavedSearch));
    }

    @OperationID("saved_searches#destroy")
    async delete(id: number): Promise<null> {
        return savedSearches_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("saved_searches#show")
    async get(id: number): Promise<SavedSearch | null> {
        return savedSearches_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, SavedSearch));
    }

    @OperationID("saved_searches#index")
    async list(): Promise<Array<SavedSearch>> {
        return savedSearches_index({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, SavedSearch));
    }

    @OperationID("saved_searches#mark_all_seen")
    async markAllSeen(): Promise<null> {
        return savedSearches_markAllSeen({
            client: this.client,
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("saved_searches#update")
    async update(id: number, options: UpdateSavedSearchOptions): Promise<SavedSearch> {
        return savedSearches_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "saved_search"),
        }).then(res => this._handleResponse(res, 200, true, SavedSearch));
    }
}
