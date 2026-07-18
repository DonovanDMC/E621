import { userNameChangeRequests_create, userNameChangeRequests_destroy, userNameChangeRequests_show, userNameChangeRequests_index } from "../generated/sdk.js";
import UserNameChangeRequest from "../models/UserNameChangeRequest.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { UserNameChangeRequestsCreateData, UserNameChangeRequestsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateUserNameChangeRequestOptions extends TransformDataBodyToOptions<UserNameChangeRequestsCreateData> {}
/** @category Modules/Types */
export interface SearchUserNameChangeRequestsOptions extends TransformDataQueryToOptions<UserNameChangeRequestsIndexData> {}

/** @category Modules */
export default class UserNameChangeRequests extends Base {
    @OperationID("user_name_change_requests#create")
    async create(options: CreateUserNameChangeRequestOptions): Promise<unknown> {
        return userNameChangeRequests_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("user_name_change_requests#destroy")
    async delete(id: number): Promise<unknown> {
        return userNameChangeRequests_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("user_name_change_requests#show")
    async get(id: number): Promise<UserNameChangeRequest | null> {
        return userNameChangeRequests_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, UserNameChangeRequest));
    }

    @OperationID("user_name_change_requests#index")
    async search(options?: SearchUserNameChangeRequestsOptions): Promise<Array<UserNameChangeRequest>> {
        return userNameChangeRequests_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, UserNameChangeRequest));
    }
}
