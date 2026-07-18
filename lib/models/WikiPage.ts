import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { WikiPage as WikiPageData } from "../generated/types.js";
import type { UpdateWikiPageOptions } from "../modules/WikiPages.js";

interface WikiPage extends WikiPageData {}
/** @category Models */
@Schema("WikiPage")
class WikiPage extends Base<WikiPageData> {
    @OperationID("wiki_pages#destroy")
    async delete(): Promise<null> {
        return this.e621.wikiPages.delete(this.id);
    }

    @OperationID("wiki_pages#revert")
    async revert(version_id: number): Promise<null> {
        return this.e621.wikiPages.revert(this.id, version_id);
    }

    @OperationID("wiki_pages#update")
    async update(options: UpdateWikiPageOptions): Promise<null> {
        return this.e621.wikiPages.update(this.id, options);
    }
}

export default WikiPage;
