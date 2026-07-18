import { tagCorrections_create, tagCorrections_show } from "../generated/sdk.js";
import TagCorrection from "../models/TagCorrection.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class TagCorrections extends Base {
    static readonly moduleKey = "tagCorrections" as const;
    @OperationID("tag_corrections#create")
    async correct(id: number): Promise<string> {
        return tagCorrections_create({
            client: this.client,
            path: { id },
            body: { commit: "Fix" },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("tag_corrections#show")
    async get(id: number): Promise<TagCorrection> {
        return tagCorrections_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, TagCorrection));
    }
}
