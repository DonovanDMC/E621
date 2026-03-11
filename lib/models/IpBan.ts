import Base from "./Base.js";
import type { IpBan as IpBanData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface IpBan extends IpBanData {}
/** @category Models */
@Schema("IpBan")
class IpBan extends Base<IpBanData> {
    @OperationID("deleteIpBan")
    async delete(): Promise<null> {
        return this.e621.ipBans.delete(this.id);
    }
}

export default IpBan;
