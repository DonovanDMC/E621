import Base from "./Base.js";
import type { UploadWhitelist as UploadWhitelistData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditUploadWhitelistOptions } from "../modules/UploadWhitelists.js";

interface UploadWhitelist extends UploadWhitelistData {}
/** @category Models */
@Schema("UploadWhitelist")
class UploadWhitelist extends Base<UploadWhitelistData> {
    @OperationID("deleteUploadWhitelist")
    async delete(): Promise<null> {
        return this.e621.uploadWhitelists.delete(this.id);
    }

    @OperationID("editUploadWhitelist")
    async edit(options: EditUploadWhitelistOptions): Promise<null> {
        return this.e621.uploadWhitelists.edit(this.id, options);
    }

}

export default UploadWhitelist;
