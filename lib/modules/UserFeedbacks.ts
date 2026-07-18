import {
    userFeedbacks_create,
    userFeedbacks_delete,
    userFeedbacks_destroy,
    userFeedbacks_update,
    userFeedbacks_show,
    userFeedbacks_index,
    userFeedbacks_undelete,
} from "../generated/sdk.js";
import UserFeedback from "../models/UserFeedback.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { UserFeedbacksCreateData, UserFeedbacksUpdateData, UserFeedbacksIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateUserFeedbackOptions extends TransformDataBodyToOptions<UserFeedbacksCreateData> {}
/** @category Modules/Types */
export interface UpdateUserFeedbackOptions extends TransformDataBodyToOptions<UserFeedbacksUpdateData> {}
/** @category Modules/Types */
export interface SearchUserFeedbacksOptions extends TransformDataQueryToOptions<UserFeedbacksIndexData> {}

/** @category Modules */
export default class UserFeedbacks extends Base {
    @OperationID("user_feedbacks#create")
    async create(options: CreateUserFeedbackOptions): Promise<UserFeedback> {
        return userFeedbacks_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, UserFeedback));
    }

    @OperationID("user_feedbacks#delete")
    async delete(id: number): Promise<null> {
        return userFeedbacks_delete({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("user_feedbacks#destroy")
    async destroy(id: number): Promise<null> {
        return userFeedbacks_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("user_feedbacks#show")
    async get(id: number): Promise<UserFeedback | null> {
        return userFeedbacks_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, UserFeedback));
    }

    @OperationID("user_feedbacks#index")
    async search(options?: SearchUserFeedbacksOptions): Promise<Array<UserFeedback>> {
        return userFeedbacks_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, UserFeedback));
    }

    @OperationID("user_feedbacks#undelete")
    async undelete(id: number): Promise<null> {
        return userFeedbacks_undelete({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("user_feedbacks#update")
    async update(id: number, options: UpdateUserFeedbackOptions): Promise<null> {
        return userFeedbacks_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
