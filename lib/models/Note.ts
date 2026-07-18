import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Note as NoteData } from "../generated/types.js";
import type { UpdateNoteOptions } from "../modules/Notes.js";

interface Note extends NoteData {}
/** @category Models */
@Schema("Note")
class Note extends Base<NoteData> {
    @OperationID("notes#destroy")
    async delete(): Promise<null> {
        return this.e621.notes.delete(this.id);
    }

    @OperationID("notes#revert")
    async revert(version_id: number): Promise<null> {
        return this.e621.notes.revert(this.id, version_id);
    }

    @OperationID("notes#update")
    async update(options: UpdateNoteOptions): Promise<null> {
        return this.e621.notes.update(this.id, options);
    }
}

export default Note;
