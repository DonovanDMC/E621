import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UpdateNewsUpdateOptions } from "../modules/NewsUpdates.js";
import type { NewsUpdate as NewsUpdateData } from "e621-openapi/types";

interface NewsUpdate extends NewsUpdateData {}
/** @category Models */
@Schema("NewsUpdate")
class NewsUpdate extends Base<NewsUpdateData> {
    @OperationID("news_updates#destroy")
    async delete(): Promise<null> {
        return this.e621.newsUpdates.delete(this.id);
    }

    @OperationID("news_updates#update")
    async update(options: UpdateNewsUpdateOptions): Promise<null> {
        return this.e621.newsUpdates.update(this.id, options);
    }
}

export default NewsUpdate;
