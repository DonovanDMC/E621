import Base from "./Base.js";
import type { WikiPageVersion as WikiPageVersionData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface WikiPageVersion extends WikiPageVersionData {}
/** @category Models */
@Schema("WikiPageVersion")
class WikiPageVersion extends Base<WikiPageVersionData> {
    @OperationID("revertWikiPage")
    async revertTo(): Promise<null> {
        return this.e621.wikiPages.revert(this.wiki_page_id, this.id);
    }
}

export default WikiPageVersion;
