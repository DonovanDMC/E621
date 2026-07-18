import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UserNameChangeRequest as UserNameChangeRequestData } from "../generated/types.js";

interface UserNameChangeRequest extends UserNameChangeRequestData {}
/** @category Models */
@Schema("UserNameChangeRequest")
class UserNameChangeRequest extends Base<UserNameChangeRequestData> {
    @OperationID("user_name_change_requests#destroy")
    async delete(): Promise<unknown> {
        return this.e621.userNameChangeRequests.delete(this.id);
    }
}

export default UserNameChangeRequest;
