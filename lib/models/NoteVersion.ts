import Base from "./Base.js";
import type { NoteVersion as NoteVersionData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface NoteVersion extends NoteVersionData {}
/** @category Models */
@Schema("NoteVersion")
class NoteVersion extends Base<NoteVersionData> {
    @OperationID("revertNote")
    async revertTo(): Promise<null> {
        return this.e621.notes.revert(this.note_id, this.id);
    }
}

export default NoteVersion;
