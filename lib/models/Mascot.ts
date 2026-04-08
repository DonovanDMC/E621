import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Mascot as MascotData } from "../generated/types.js";
import type { EditMascotOptions } from "../modules/Mascots.js";

interface Mascot extends MascotData {}
/** @category Models */
@Schema("Mascot")
class Mascot extends Base<MascotData> {
    @OperationID("deleteMascot")
    async delete(): Promise<null> {
        return this.e621.mascots.delete(this.id);
    }

    @OperationID("editMascot")
    async edit(options: EditMascotOptions): Promise<null> {
        return this.e621.mascots.edit(this.id, options);
    }
}

export default Mascot;
