import Base from "./Base.js";
import {
    createBlip,
    deleteBlip,
    editBlip,
    getBlip,
    hideBlip,
    markBlip,
    searchBlips,
    unhideBlip
} from "../generated/sdk.js";
import type {
    CreateBlipData,
    EditBlipData,
    MarkBlipResponses,
    SearchBlipsData,
    WarningRecordType
} from "../generated/types.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions
} from "../util.js";
import Blip from "../models/Blip.js";

/** @category Modules/Types */
export interface SearchBlipsOptions extends TransformDataQueryToOptions<SearchBlipsData> {}
/** @category Modules/Types */
export interface CreateBlipOptions extends TransformDataBodyToOptions<CreateBlipData> {}
/** @category Modules/Types */
export interface EditBlipOptions extends TransformDataBodyToOptions<EditBlipData> {}
/** @category Modules/Types */
export interface MarkBlipResponse extends GetResponse<MarkBlipResponses, 200> {}

/** @category Modules */
export default class Blips extends Base {
    @OperationID("createBlip")
    async create(options: CreateBlipOptions): Promise<Blip> {
        return createBlip({
            client: this.client,
            body:   prefixKeys(options, "blip")
        }).then(res => this._handleResponse(res, 201, true, Blip));
    }

    @OperationID("deleteBlip")
    async delete(id: number): Promise<null> {
        return deleteBlip({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editBlip")
    async edit(id: number, options: EditBlipOptions): Promise<null> {
        return editBlip({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "blip")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getBlip")
    async get(id: number): Promise<Blip | null> {
        return getBlip({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, Blip));
    }

    @OperationID("hideBlip")
    async hide(id: number): Promise<Blip> {
        return hideBlip({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, Blip));
    }

    @OperationID("markBlip")
    async mark(id: number, type: WarningRecordType["record_type"]): Promise<MarkBlipResponse> {
        return markBlip({
            client: this.client,
            path:   { id },
            body:   { record_type: type }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("searchBlips")
    async search(options?: SearchBlipsOptions): Promise<Array<Blip>> {
        return searchBlips({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, Blip));
    }

    @OperationID("unhideBlip")
    async unhide(id: number): Promise<Blip> {
        return unhideBlip({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, Blip));
    }
}
