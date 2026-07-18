import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { HelpPage as HelpPageData } from "../generated/types.js";
import type { UpdateHelpPageOptions } from "../modules/HelpPages.js";

interface HelpPage extends HelpPageData {}
/** @category Models */
@Schema("HelpPage")
class HelpPage extends Base<HelpPageData> {
    @OperationID("help#destroy")
    async delete(): Promise<null> {
        return this.e621.helpPages.delete(this.id);
    }

    @OperationID("help#update")
    async update(options: UpdateHelpPageOptions): Promise<null> {
        return this.e621.helpPages.update(this.id, options);
    }
}

export default HelpPage;
