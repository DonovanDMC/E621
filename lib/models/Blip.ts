import { type ExtractValue, OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Blip as BlipData, BlipsWarningData } from "../generated/types.js";
import type { UpdateBlipOptions, BlipsWarningResponse } from "../modules/Blips.js";

interface Blip extends BlipData {}
/** @category Models */
@Schema("Blip")
class Blip extends Base<BlipData> {
    @OperationID("blips#delete")
    async delete(): Promise<string> {
        return this.e621.blips.delete(this.id);
    }

    @OperationID("blips#destroy")
    async destroy(): Promise<null> {
        return this.e621.blips.destroy(this.id);
    }

    @OperationID("blips#warning")
    async mark(type: ExtractValue<"record_type", BlipsWarningData>): Promise<BlipsWarningResponse> {
        return this.e621.blips.mark(this.id, type);
    }

    @OperationID("blips#undelete")
    async undelete(): Promise<string> {
        return this.e621.blips.undelete(this.id);
    }

    @OperationID("blips#update")
    async update(options: UpdateBlipOptions): Promise<null> {
        return this.e621.blips.update(this.id, options);
    }
}

export default Blip;
