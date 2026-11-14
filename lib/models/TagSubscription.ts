import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { TagSubscription as TagSubscriptionData } from "e621-openapi/types";

interface TagSubscription extends TagSubscriptionData {}
/** @category Models */
@Schema("TagSubscription")
class TagSubscription extends Base<TagSubscriptionData> {
    @OperationID("tag_subscriptions#destroy")
    async delete(): Promise<null> {
        return this.e621.tagSubscriptions.delete(this.id);
    }
}

export default TagSubscription;
