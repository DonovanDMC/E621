import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UploadWhitelist as UploadWhitelistData } from "../generated/types.js";
import type { UpdateUploadWhitelistOptions } from "../modules/UploadWhitelists.js";

interface UploadWhitelist extends UploadWhitelistData {}
/** @category Models */
@Schema("UploadWhitelist")
class UploadWhitelist extends Base<UploadWhitelistData> {
    @OperationID("upload_whitelists#destroy")
    async delete(): Promise<null> {
        return this.e621.uploadWhitelists.delete(this.id);
    }

    @OperationID("upload_whitelists#update")
    async update(options: UpdateUploadWhitelistOptions): Promise<null> {
        return this.e621.uploadWhitelists.update(this.id, options);
    }
}

export default UploadWhitelist;
