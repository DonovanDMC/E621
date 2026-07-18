import {
    avoidPostings_create,
    avoidPostings_delete,
    avoidPostings_destroy,
    avoidPostings_update,
    avoidPostings_show,
    avoidPostings_index,
    avoidPostings_undelete,
} from "../generated/sdk.js";
import AvoidPosting from "../models/AvoidPosting.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { AvoidPostingsCreateData, AvoidPostingsUpdateData, AvoidPostingsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateAvoidPostingOptions extends TransformDataBodyToOptions<AvoidPostingsCreateData> {}
/** @category Modules/Types */
export interface UpdateAvoidPostingOptions extends TransformDataBodyToOptions<AvoidPostingsUpdateData> {}
/** @category Modules/Types */
export interface SearchAvoidPostingsOptions extends TransformDataQueryToOptions<AvoidPostingsIndexData> {}

/** @category Modules */
export default class AvoidPostings extends Base {
    @OperationID("avoid_postings#create")
    async create(options: CreateAvoidPostingOptions): Promise<AvoidPosting> {
        return avoidPostings_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, AvoidPosting));
    }

    @OperationID("avoid_postings#delete")
    async delete(idOrName: string | number): Promise<null> {
        return avoidPostings_delete({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("avoid_postings#destroy")
    async destroy(idOrName: string | number): Promise<null> {
        return avoidPostings_destroy({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("avoid_postings#show")
    async get(idOrName: number | string): Promise<AvoidPosting | null> {
        return avoidPostings_show({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 200, false, AvoidPosting));
    }

    @OperationID("avoid_postings#index")
    async search(options?: SearchAvoidPostingsOptions): Promise<Array<AvoidPosting>> {
        return avoidPostings_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, AvoidPosting));
    }

    @OperationID("avoid_postings#undelete")
    async undelete(idOrName: string | number): Promise<null> {
        return avoidPostings_undelete({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("avoid_postings#update")
    async update(idOrName: string | number, options?: UpdateAvoidPostingOptions): Promise<null> {
        return avoidPostings_update({
            client: this.client,
            path: { idOrName },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
