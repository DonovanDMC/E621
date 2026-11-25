import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UpdateStaffUserOptions } from "../modules/StaffUsers.js";
import type { User as UserData } from "e621-openapi/types";

interface User extends UserData {}
/** @category Models */
@Schema("User")
class User<D extends UserData = UserData> extends Base<D> {
    @OperationID("staff/users#update")
    async adminEdit(options: UpdateStaffUserOptions): Promise<string> {
        return this.e621.staffUsers.update(this.id, options);
    }

    @OperationID("users#flush_favorites")
    async clearFavorites(): Promise<unknown> {
        return this.e621.users.clearFavorites(this.id);
    }

    @OperationID("maintenance/user/count_fixes#create")
    async fixCounts(): Promise<unknown> {
        return this.e621.users.fixCounts();
    }

    @OperationID("users#fix_counts")
    async staffFixCounts(): Promise<unknown> {
        return this.e621.users.staffFixCounts(this.id);
    }

    @OperationID("users#upload_limit")
    async uploadLimit(): Promise<User> {
        return this.e621.users.uploadLimit(this.id)
            .then((res) => {
                if (res === null) throw new Error(`Got null getUploadLimit for user ${this.id}`);
                return res;
            });
    }
}

export default User;
