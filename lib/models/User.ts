import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { User as UserData } from "../generated/types.js";
import type { AdminEditUserOptions } from "../modules/admin/Users.js";

interface User extends UserData {}
/** @category Models */
@Schema("User")
class User<D extends UserData = UserData> extends Base<D> {
    @OperationID("adminEditUser")
    async adminEdit(options: AdminEditUserOptions): Promise<null> {
        return this.e621.admin.users.edit(this.id, options);
    }

    @OperationID("adminAnonymizeUser")
    async anonymize(): Promise<unknown> {
        return this.e621.admin.users.anonymize(this.id);
    }

    @OperationID("clearUserFavorites")
    async clearFavorites(): Promise<unknown> {
        return this.e621.users.clearFavorites(this.id);
    }

    @OperationID("fixUserCounts")
    async fixCounts(): Promise<unknown> {
        return this.e621.users.fixCounts();
    }

    @OperationID("staffFixUserCounts")
    async staffFixCounts(): Promise<unknown> {
        return this.e621.users.staffFixCounts(this.id);
    }

    @OperationID("toggleUserUploads")
    async toggleUploads(): Promise<string> {
        return this.e621.users.toggleUploads(this.id);
    }

    @OperationID("getUserUploadLimit")
    async uploadLimit(): Promise<User> {
        return this.e621.users.uploadLimit(this.id)
            .then((res) => {
                if (res === null) throw new Error(`Got null getUploadLimit for user ${this.id}`);
                return res;
            });
    }
}

export default User;
