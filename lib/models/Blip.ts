import Base from "./Base.js";
import type { Blip as BlipData, MarkBlipData, MarkBlipResponses } from "../generated/types.js";
import { type ExtractValue, OperationID, Schema } from "../util.js";
import type { EditBlipOptions } from "../modules/Blips.js";

interface Blip extends BlipData {}
/** @category Models */
@Schema("Blip")
class Blip extends Base<BlipData> {
    @OperationID("deleteBlip")
    async delete(): Promise<null> {
        return this.e621.blips.delete(this.id);
    }

    @OperationID("editBlip")
    async edit(options: EditBlipOptions): Promise<null> {
        return this.e621.blips.edit(this.id, options);
    }

    @OperationID("hideBlip")
    async hide(): Promise<Blip> {
        return this.e621.blips.hide(this.id);
    }

    @OperationID("markBlip")
    async mark(type: ExtractValue<"record_type", MarkBlipData>): Promise<MarkBlipResponses[200]> {
        return this.e621.blips.mark(this.id, type);
    }

    @OperationID("unhideBlip")
    async unhide(): Promise<Blip> {
        return this.e621.blips.unhide(this.id);
    }

}

export default Blip;
