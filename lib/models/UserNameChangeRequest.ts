import Base from "./Base.js";
import type { UserNameChangeRequest as UserNameChangeRequestData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface UserNameChangeRequest extends UserNameChangeRequestData {}
/** @category Models */
@Schema("UserNameChangeRequest")
class UserNameChangeRequest extends Base<UserNameChangeRequestData> {
    @OperationID("deleteUserNameChangeRequest")
    async delete(): Promise<unknown> {
        return this.e621.userNameChangeRequests.delete(this.id);
    }

}

export default UserNameChangeRequest;
