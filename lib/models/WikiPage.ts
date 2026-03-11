import Base from "./Base.js";
import type { WikiPage as WikiPageData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditWikiPageOptions } from "../modules/WikiPages.js";

interface WikiPage extends WikiPageData {}
/** @category Models */
@Schema("WikiPage")
class WikiPage extends Base<WikiPageData> {
    @OperationID("deleteWikiPage")
    async delete(): Promise<null> {
        return this.e621.wikiPages.delete(this.id);
    }

    @OperationID("editWikiPage")
    async edit(options: EditWikiPageOptions): Promise<null> {
        return this.e621.wikiPages.edit(this.id, options);
    }

    @OperationID("revertWikiPage")
    async revert(version_id: number): Promise<null> {
        return this.e621.wikiPages.revert(this.id, version_id);
    }

}

export default WikiPage;
