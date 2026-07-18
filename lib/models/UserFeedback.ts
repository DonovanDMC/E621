import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UserFeedback as UserFeedbackData } from "../generated/types.js";
import type { UpdateUserFeedbackOptions } from "../modules/UserFeedbacks.js";

interface UserFeedback extends UserFeedbackData {}
/** @category Models */
@Schema("UserFeedback")
class UserFeedback extends Base<UserFeedbackData> {
    @OperationID("user_feedbacks#delete")
    async delete(): Promise<null> {
        return this.e621.userFeedbacks.delete(this.id);
    }

    @OperationID("user_feedbacks#destroy")
    async destroy(): Promise<null> {
        return this.e621.userFeedbacks.destroy(this.id);
    }

    @OperationID("user_feedbacks#undelete")
    async undelete(): Promise<null> {
        return this.e621.userFeedbacks.undelete(this.id);
    }

    @OperationID("user_feedbacks#update")
    async update(options: UpdateUserFeedbackOptions): Promise<null> {
        return this.e621.userFeedbacks.update(this.id, options);
    }
}

export default UserFeedback;
