import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { IPBan as IPBanData } from "../generated/types.js";

interface IPBan extends IPBanData {}
/** @category Models */
@Schema("IPBan")
class IPBan extends Base<IPBanData> {
    @OperationID("ip_bans#destroy")
    async delete(): Promise<null> {
        return this.e621.ipBans.delete(this.id);
    }
}

export default IPBan;
