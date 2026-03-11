import Base from "./Base.js";
import { previewDText } from "../generated/sdk.js";
import { type PreviewDTextResponses } from "../generated/types.js";
import { OperationID } from "../util.js";

/** @category Modules */
export default class DText extends Base {
    @OperationID("previewDText")
    async preview(body: string): Promise<PreviewDTextResponses[200]> {
        return previewDText({
            client: this.client,
            body:   { body }
        }).then(res => this._handleResponse(res, 200, true));
    }
}
