import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { NewsUpdate as NewsUpdateData } from "../generated/types.js";
import type { EditNewsUpdateOptions } from "../modules/NewsUpdates.js";

interface NewsUpdate extends NewsUpdateData {}
/** @category Models */
@Schema("NewsUpdate")
class NewsUpdate extends Base<NewsUpdateData> {
    @OperationID("deleteNewsUpdate")
    async delete(): Promise<null> {
        return this.e621.newsUpdates.delete(this.id);
    }

    @OperationID("editNewsUpdate")
    async edit(options: EditNewsUpdateOptions): Promise<null> {
        return this.e621.newsUpdates.edit(this.id, options);
    }
}

export default NewsUpdate;
