import { railsHealth_show } from "e621-openapi/sdk";

import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { RailsHealthShowResponses } from "e621-openapi/types";

/** @category Modules/Types */
export interface RailsHealthShowResponse extends GetResponse<RailsHealthShowResponses, 200> {}

/** @category Modules */
export default class RailsHealth extends Base {
    static readonly moduleKey = "railsHealth" as const;
    @OperationID("rails/health#show")
    async get(): Promise<RailsHealthShowResponse> {
        return railsHealth_show({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
