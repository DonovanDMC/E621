import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { IpBan as IpBanData } from "../generated/types.js";

interface IpBan extends IpBanData {}
/** @category Models */
@Schema("IpBan")
class IpBan extends Base<IpBanData> {
    @OperationID("ip_bans#destroy")
    async delete(): Promise<null> {
        return this.e621.ipBans.delete(this.id);
    }
}

export default IpBan;
