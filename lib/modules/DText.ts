import { previewDText } from "../generated/sdk.js";
import { type PreviewDTextResponses } from "../generated/types.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface PreviewDTextResponse extends GetResponse<PreviewDTextResponses, 200> {}

/** @category Modules */
export default class DText extends Base {
    @OperationID("previewDText")
    async preview(body: string): Promise<PreviewDTextResponse> {
        return previewDText({
            client: this.client,
            body: { body },
        }).then(res => this._handleResponse(res, 200, true));
    }
}
