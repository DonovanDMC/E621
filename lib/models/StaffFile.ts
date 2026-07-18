import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { StaffFile as StaffFileData } from "../generated/types.js";
import type { UpdateStaffFileOptions } from "../modules/staff/Files.js";

interface StaffFile extends StaffFileData {}
/** @category Models */
@Schema("StaffFile")
class StaffFile extends Base<StaffFileData> {
    @OperationID("staff/files#destroy")
    async delete(): Promise<null> {
        return this.e621.staff.files.delete(this.id);
    }

    @OperationID("staff/files#update")
    async update(options: UpdateStaffFileOptions): Promise<null> {
        return this.e621.staff.files.update(this.id, options);
    }
}

export default StaffFile;
