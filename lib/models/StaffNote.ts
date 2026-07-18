import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { StaffNote as StaffNoteData } from "../generated/types.js";
import type { UpdateStaffNoteOptions } from "../modules/StaffNotes.js";

interface StaffNote extends StaffNoteData {}
/** @category Models */
@Schema("StaffNote")
class StaffNote extends Base<StaffNoteData> {
    @OperationID("staff_notes#delete")
    async delete(): Promise<StaffNote> {
        return this.e621.staffNotes.delete(this.id);
    }

    @OperationID("staff_notes#undelete")
    async undelete(): Promise<StaffNote> {
        return this.e621.staffNotes.undelete(this.id);
    }

    @OperationID("staff_notes#update")
    async update(options: UpdateStaffNoteOptions): Promise<StaffNote> {
        return this.e621.staffNotes.update(this.id, options);
    }
}

export default StaffNote;
