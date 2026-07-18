import {
    blips_create,
    blips_destroy,
    blips_update,
    blips_show,
    blips_delete,
    blips_warning,
    blips_index,
    blips_undelete,
} from "../generated/sdk.js";
import Blip from "../models/Blip.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
} from "../util.js";

import Base from "./Base.js";

import type {
    BlipsCreateData,
    BlipsUpdateData,
    BlipsWarningResponses,
    BlipsIndexData,
    WarningRecordType,
} from "../generated/types.js";

/** @category Modules/Types */
export interface SearchBlipsOptions extends TransformDataQueryToOptions<BlipsIndexData> {}
/** @category Modules/Types */
export interface CreateBlipOptions extends TransformDataBodyToOptions<BlipsCreateData> {}
/** @category Modules/Types */
export interface UpdateBlipOptions extends TransformDataBodyToOptions<BlipsUpdateData> {}
/** @category Modules/Types */
export interface BlipsWarningResponse extends GetResponse<BlipsWarningResponses, 200> {}

/** @category Modules */
export default class Blips extends Base {
    static readonly moduleKey = "blips" as const;
    @OperationID("blips#create")
    async create(options: CreateBlipOptions): Promise<Blip> {
        return blips_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, Blip));
    }

    @OperationID("blips#delete")
    async delete(id: number): Promise<string> {
        return blips_delete({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("blips#destroy")
    async destroy(id: number): Promise<null> {
        return blips_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("blips#show")
    async get(id: number): Promise<Blip | null> {
        return blips_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Blip));
    }

    @OperationID("blips#warning")
    async mark(id: number, type: WarningRecordType["record_type"]): Promise<BlipsWarningResponse> {
        return blips_warning({
            client: this.client,
            path: { id },
            body: { record_type: type },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("blips#index")
    async search(options?: SearchBlipsOptions): Promise<Array<Blip>> {
        return blips_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Blip));
    }

    @OperationID("blips#undelete")
    async undelete(id: number): Promise<string> {
        return blips_undelete({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("blips#update")
    async update(id: number, options: UpdateBlipOptions): Promise<null> {
        return blips_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
