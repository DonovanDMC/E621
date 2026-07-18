import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { DMail as DMailData } from "../generated/types.js";

interface DMail extends DMailData {}
/** @category Models */
@Schema("DMail")
class DMail extends Base<DMailData> {
    @OperationID("dmails#destroy")
    async delete(): Promise<null> {
        return this.e621.dmails.delete(this.id);
    }

    @OperationID("dmails#mark_as_read")
    async markRead(): Promise<null> {
        return this.e621.dmails.markRead(this.id);
    }

    @OperationID("dmails#mark_as_unread")
    async markUnread(): Promise<null> {
        return this.e621.dmails.markUnread(this.id);
    }

    @OperationID("maintenance/user/dmail_filters#update")
    async updateFilter(words: string): Promise<null> {
        return this.e621.users.updateDmailFilter(this.id, words);
    }
}

export default DMail;
