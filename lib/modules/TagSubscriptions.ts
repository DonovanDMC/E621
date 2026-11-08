import { tagSubscriptions_create, tagSubscriptions_destroy, tagSubscriptions_index } from "../generated/sdk.js";
import TagSubscription from "../models/TagSubscription.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { TagSubscriptionsCreateResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateTagSubscriptionsResponse extends Omit<GetResponse<TagSubscriptionsCreateResponses, 200>, "added"> {
    added: Array<TagSubscription>;
}

/** @category Modules */
export default class TagSubscriptions extends Base {
    static readonly moduleKey = "tagSubscriptions" as const;
    /** Subscribe to one or more tags. Tags that couldn't be subscribed to are listed in `skipped`. */
    @OperationID("tag_subscriptions#create")
    async create(tags: string | Array<string>): Promise<CreateTagSubscriptionsResponse> {
        return tagSubscriptions_create({
            client: this.client,
            body: { tag_names: Array.isArray(tags) ? tags.join(" ") : tags },
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return { ...data, added: data.added.map(sub => new TagSubscription(this.e621, sub)) };
        });
    }

    @OperationID("tag_subscriptions#destroy")
    async delete(id: number): Promise<null> {
        return tagSubscriptions_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("tag_subscriptions#index")
    async list(): Promise<Array<TagSubscription>> {
        return tagSubscriptions_index({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, TagSubscription));
    }
}
