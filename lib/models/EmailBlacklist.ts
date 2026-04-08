import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { EmailBlacklist as EmailBlacklistData } from "../generated/types.js";

interface EmailBlacklist extends EmailBlacklistData {}
/** @category Models */
@Schema("EmailBlacklist")
class EmailBlacklist extends Base<EmailBlacklistData> {
    @OperationID("deleteEmailBlacklist")
    async delete(): Promise<null> {
        return this.e621.emailBlacklists.delete(this.id);
    }
}

export default EmailBlacklist;
