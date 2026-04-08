import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Help as HelpData } from "../generated/types.js";
import type { EditHelpPageOptions } from "../modules/HelpPages.js";

interface Help extends HelpData {}
/** @category Models */
@Schema("Help")
class Help extends Base<HelpData> {
    @OperationID("deleteHelpPage")
    async delete(): Promise<null> {
        return this.e621.helpPages.delete(this.id);
    }

    @OperationID("editHelpPage")
    async edit(options: EditHelpPageOptions): Promise<null> {
        return this.e621.helpPages.edit(this.id, options);
    }
}

export default Help;
