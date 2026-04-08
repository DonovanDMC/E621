import { correctTag, getTagCorrection } from "../generated/sdk.js";
import TagCorrection from "../models/TagCorrection.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class TagCorrections extends Base {
    @OperationID("correctTag")
    async correct(id: number): Promise<string> {
        return correctTag({
            client: this.client,
            path: { id },
            body: { commit: "Fix" },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("getTagCorrection")
    async get(id: number): Promise<TagCorrection> {
        return getTagCorrection({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, TagCorrection));
    }
}
