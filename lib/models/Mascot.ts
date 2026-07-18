import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Mascot as MascotData } from "../generated/types.js";
import type { UpdateMascotOptions } from "../modules/Mascots.js";

interface Mascot extends MascotData {}
/** @category Models */
@Schema("Mascot")
class Mascot extends Base<MascotData> {
    @OperationID("mascots#destroy")
    async delete(): Promise<null> {
        return this.e621.mascots.delete(this.id);
    }

    @OperationID("mascots#update")
    async update(options: UpdateMascotOptions): Promise<null> {
        return this.e621.mascots.update(this.id, options);
    }
}

export default Mascot;
