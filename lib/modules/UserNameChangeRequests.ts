import Base from "./Base.js";
import { createUserNameChangeRequest, deleteUserNameChangeRequest, getUserNameChangeRequest, searchUserNameChangeRequests } from "../generated/sdk.js";
import type { CreateUserNameChangeRequestData, SearchUserNameChangeRequestsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import UserNameChangeRequest from "../models/UserNameChangeRequest.js";

/** @category Modules/Types */
export interface CreateUserNameChangeRequestOptions extends TransformDataBodyToOptions<CreateUserNameChangeRequestData> {}
/** @category Modules/Types */
export interface SearchUserNameChangeRequestsOptions extends TransformDataQueryToOptions<SearchUserNameChangeRequestsData> {}

/** @category Modules */
export default class UserNameChangeRequests extends Base {
    @OperationID("createUserNameChangeRequest")
    async create(options: CreateUserNameChangeRequestOptions): Promise<unknown> {
        return createUserNameChangeRequest({
            client: this.client,
            body:   prefixKeys(options, "user_name_change_request")
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("deleteUserNameChangeRequest")
    async delete(id: number): Promise<unknown> {
        return deleteUserNameChangeRequest({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("getUserNameChangeRequest")
    async get(id: number): Promise<UserNameChangeRequest | null> {
        return getUserNameChangeRequest({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, UserNameChangeRequest));
    }

    @OperationID("searchUserNameChangeRequests")
    async search(options?: SearchUserNameChangeRequestsOptions): Promise<Array<UserNameChangeRequest>> {
        return searchUserNameChangeRequests({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, UserNameChangeRequest));
    }
}
