import Base from "./Base.js";
import {
    createHelpPage,
    deleteHelpPage,
    editHelpPage,
    getHelpPage,
    listHelpPages
} from "../generated/sdk.js";
import type { CreateHelpPageData, EditHelpPageData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";
import Help from "../models/Help.js";

/** @category Modules/Types */
export interface CreateHelpPageOptions extends TransformDataBodyToOptions<CreateHelpPageData> {}
/** @category Modules/Types */
export interface EditHelpPageOptions extends TransformDataBodyToOptions<EditHelpPageData> {}

/** @category Modules */
export default class HelpPages extends Base {
    @OperationID("createHelpPage")
    async create(options: CreateHelpPageOptions): Promise<Help> {
        return createHelpPage({
            client: this.client,
            body:   prefixKeys(options, "help_page")
        }).then(res => this._handleResponse(res, 201, true, Help));
    }

    @OperationID("deleteHelpPage")
    async delete(id: number): Promise<null> {
        return deleteHelpPage({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editHelpPage")
    async edit(id: number, options: EditHelpPageOptions): Promise<null> {
        return editHelpPage({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "help_page")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getHelpPage")
    async get(id: number | string): Promise<Help | null> {
        return getHelpPage({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, Help));
    }

    @OperationID("listHelpPages")
    async list(): Promise<Array<Help>> {
        return listHelpPages({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true, Help));
    }
}
