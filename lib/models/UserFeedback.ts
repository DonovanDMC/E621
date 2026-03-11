import Base from "./Base.js";
import type { UserFeedback as UserFeedbackData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditUserFeedbackOptions } from "../modules/UserFeedbacks.js";

interface UserFeedback extends UserFeedbackData {}
/** @category Models */
@Schema("UserFeedback")
class UserFeedback extends Base<UserFeedbackData> {
    @OperationID("deleteUserFeedback")
    async delete(): Promise<null> {
        return this.e621.userFeedbacks.delete(this.id);
    }

    @OperationID("destroyUserFeedback")
    async destroy(): Promise<null> {
        return this.e621.userFeedbacks.destroy(this.id);
    }

    @OperationID("editUserFeedback")
    async edit(options: EditUserFeedbackOptions): Promise<null> {
        return this.e621.userFeedbacks.edit(this.id, options);
    }

    @OperationID("undeleteUserFeedback")
    async undelete(): Promise<null> {
        return this.e621.userFeedbacks.undelete(this.id);
    }

}

export default UserFeedback;
