import Base from "./Base.js";
import type { StaffNote as StaffNoteData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditStaffNoteOptions } from "../modules/StaffNotes.js";

interface StaffNote extends StaffNoteData {}
/** @category Models */
@Schema("StaffNote")
class StaffNote extends Base<StaffNoteData> {
    @OperationID("deleteStaffNote")
    async delete(): Promise<StaffNote> {
        return this.e621.staffNotes.delete(this.id);
    }

    @OperationID("editStaffNote")
    async edit(options: EditStaffNoteOptions): Promise<StaffNote> {
        return this.e621.staffNotes.edit(this.id, options);
    }

    @OperationID("undeleteStaffNote")
    async undelete(): Promise<StaffNote> {
        return this.e621.staffNotes.undelete(this.id);
    }

}

export default StaffNote;
