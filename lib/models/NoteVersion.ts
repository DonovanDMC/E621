import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { NoteVersion as NoteVersionData } from "../generated/types.js";

interface NoteVersion extends NoteVersionData {}
/** @category Models */
@Schema("NoteVersion")
class NoteVersion extends Base<NoteVersionData> {
    @OperationID("notes#revert")
    async revertTo(): Promise<null> {
        return this.e621.notes.revert(this.note_id, this.id);
    }
}

export default NoteVersion;
