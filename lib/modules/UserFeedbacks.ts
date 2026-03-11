import Base from "./Base.js";
import {
    createUserFeedback,
    deleteUserFeedback,
    destroyUserFeedback,
    editUserFeedback,
    getUserFeedback,
    searchUserFeedbacks,
    undeleteUserFeedback
} from "../generated/sdk.js";
import type { CreateUserFeedbackData, EditUserFeedbackData, SearchUserFeedbacksData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import UserFeedback from "../models/UserFeedback.js";

/** @category Modules/Types */
export interface CreateUserFeedbackOptions extends TransformDataBodyToOptions<CreateUserFeedbackData> {}
/** @category Modules/Types */
export interface EditUserFeedbackOptions extends TransformDataBodyToOptions<EditUserFeedbackData> {}
/** @category Modules/Types */
export interface SearchUserFeedbacksOptions extends TransformDataQueryToOptions<SearchUserFeedbacksData> {}

/** @category Modules */
export default class UserFeedbacks extends Base {
    @OperationID("createUserFeedback")
    async create(options: CreateUserFeedbackOptions): Promise<UserFeedback> {
        return createUserFeedback({
            client: this.client,
            body:   prefixKeys(options, "user_feedback")
        }).then(res => this._handleResponse(res, 201, true, UserFeedback));
    }

    @OperationID("deleteUserFeedback")
    async delete(id: number): Promise<null> {
        return deleteUserFeedback({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("destroyUserFeedback")
    async destroy(id: number): Promise<null> {
        return destroyUserFeedback({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editUserFeedback")
    async edit(id: number, options: EditUserFeedbackOptions): Promise<null> {
        return editUserFeedback({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "user_feedback")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getUserFeedback")
    async get(id: number): Promise<UserFeedback | null> {
        return getUserFeedback({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, UserFeedback));
    }

    @OperationID("searchUserFeedbacks")
    async search(options?: SearchUserFeedbacksOptions): Promise<Array<UserFeedback>> {
        return searchUserFeedbacks({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, UserFeedback));
    }

    @OperationID("undeleteUserFeedback")
    async undelete(id: number): Promise<null> {
        return undeleteUserFeedback({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }
}
