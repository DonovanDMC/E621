import {
    help_create,
    help_destroy,
    help_update,
    help_show,
    help_index,
    help_list,
} from "../generated/sdk.js";
import HelpPage from "../models/HelpPage.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { HelpCreateData, HelpUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateHelpPageOptions extends TransformDataBodyToOptions<HelpCreateData> {}
/** @category Modules/Types */
export interface UpdateHelpPageOptions extends TransformDataBodyToOptions<HelpUpdateData> {}

/** @category Modules */
export default class HelpPages extends Base {
    static readonly moduleKey = "helpPages" as const;
    @OperationID("help#create")
    async create(options: CreateHelpPageOptions): Promise<HelpPage> {
        return help_create({
            client: this.client,
            body: prefixKeys(options, "help_page"),
        }).then(res => this._handleResponse(res, 201, true, HelpPage));
    }

    @OperationID("help#destroy")
    async delete(id: number): Promise<null> {
        return help_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("help#show")
    async get(id: number | string): Promise<HelpPage | null> {
        return help_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, HelpPage));
    }

    @OperationID("help#index")
    async landing(): Promise<HelpPage> {
        return help_index({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, HelpPage));
    }

    @OperationID("help#list")
    async list(): Promise<Array<HelpPage>> {
        return help_list({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, HelpPage));
    }

    @OperationID("help#update")
    async update(id: number, options: UpdateHelpPageOptions): Promise<null> {
        return help_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "help_page"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
