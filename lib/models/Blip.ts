import Base from "./Base.js";
import type { Blip as BlipData, MarkBlipData } from "../generated/types.js";
import { type ExtractValue, OperationID, Schema } from "../util.js";
import type { EditBlipOptions, MarkBlipResponse } from "../modules/Blips.js";


interface Blip extends BlipData {}
/** @category Models */
@Schema("Blip")
class Blip extends Base<BlipData> {
    @OperationID("destroyBlip")
    async destroy(): Promise<null> {
        return this.e621.blips.destroy(this.id);
    }

    @OperationID("editBlip")
    async edit(options: EditBlipOptions): Promise<null> {
        return this.e621.blips.edit(this.id, options);
    }

    @OperationID("deleteBlip")
    async delete(): Promise<Blip> {
        return this.e621.blips.delete(this.id);
    }

    @OperationID("markBlip")
    async mark(type: ExtractValue<"record_type", MarkBlipData>): Promise<MarkBlipResponse> {
        return this.e621.blips.mark(this.id, type);
    }

    @OperationID("undeleteBlip")
    async undelete(): Promise<Blip> {
        return this.e621.blips.undelete(this.id);
    }

}

export default Blip;
