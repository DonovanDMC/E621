import { dtextPreviews_create } from "../generated/sdk.js";
import { type DtextPreviewsCreateResponses } from "../generated/types.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface DtextPreviewsCreateResponse extends GetResponse<DtextPreviewsCreateResponses, 200> {}

/** @category Modules */
export default class DText extends Base {
    static readonly moduleKey = "dtext" as const;
    @OperationID("dtext_previews#create")
    async preview(body: string, allow_color?: boolean): Promise<DtextPreviewsCreateResponse> {
        return dtextPreviews_create({
            client: this.client,
            body: { body, allow_color },
        }).then(res => this._handleResponse(res, 200, true));
    }
}
