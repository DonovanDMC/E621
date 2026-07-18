import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { StaffWiki as StaffWikiData } from "../generated/types.js";
import type { UpdateStaffWikiOptions } from "../modules/staff/Wikis.js";

interface StaffWiki extends StaffWikiData {}
/** @category Models */
@Schema("StaffWiki")
class StaffWiki extends Base<StaffWikiData> {
    @OperationID("staff/wikis#claim")
    async claim(): Promise<StaffWiki> {
        return this.e621.staff.wikis.claim(this.id);
    }

    @OperationID("staff/wikis#destroy")
    async delete(): Promise<null> {
        return this.e621.staff.wikis.delete(this.id);
    }

    @OperationID("staff/wikis#unclaim")
    async unclaim(): Promise<StaffWiki> {
        return this.e621.staff.wikis.unclaim(this.id);
    }

    @OperationID("staff/wikis#update")
    async update(options: UpdateStaffWikiOptions): Promise<null> {
        return this.e621.staff.wikis.update(this.id, options);
    }
}

export default StaffWiki;
