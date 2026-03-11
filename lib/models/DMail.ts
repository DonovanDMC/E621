import Base from "./Base.js";
import type { DMail as DMailData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface DMail extends DMailData {}
/** @category Models */
@Schema("DMail")
class DMail extends Base<DMailData> {
    @OperationID("deleteDMail")
    async delete(): Promise<null> {
        return this.e621.dmails.delete(this.id);
    }

    @OperationID("markDMailAsRead")
    async markRead(): Promise<null> {
        return this.e621.dmails.markRead(this.id);
    }

    @OperationID("markDMailAsUnread")
    async markUnread(): Promise<null> {
        return this.e621.dmails.markUnread(this.id);
    }

}

export default DMail;
