import Base from "./Base.js";
import type { Note as NoteData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditNoteOptions } from "../modules/Notes.js";

interface Note extends NoteData {}
/** @category Models */
@Schema("Note")
class Note extends Base<NoteData> {
    @OperationID("deleteNote")
    async delete(): Promise<null> {
        return this.e621.notes.delete(this.id);
    }

    @OperationID("editNote")
    async edit(options: EditNoteOptions): Promise<null> {
        return this.e621.notes.edit(this.id, options);
    }

    @OperationID("revertNote")
    async revert(version_id: number): Promise<null> {
        return this.e621.notes.revert(this.id, version_id);
    }

}

export default Note;
