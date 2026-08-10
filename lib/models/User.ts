import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { User as UserData } from "../generated/types.js";
import type { UpdateStaffUserOptions } from "../modules/StaffUsers.js";

interface User extends UserData {}
/** @category Models */
@Schema("User")
class User<D extends UserData = UserData> extends Base<D> {
    @OperationID("staff/users#update")
    async adminEdit(options: UpdateStaffUserOptions): Promise<null> {
        return this.e621.staffUsers.update(this.id, options);
    }

    @OperationID("staff/users#anonymize_confirm")
    async anonymize(): Promise<unknown> {
        return this.e621.staffUsers.anonymize(this.id);
    }

    @OperationID("users#flush_favorites")
    async clearFavorites(): Promise<unknown> {
        return this.e621.users.clearFavorites(this.id);
    }

    @OperationID("users#disable_uploads")
    async disableUploads(reason?: string): Promise<string> {
        return this.e621.users.disableUploads(this.id, reason === undefined ? undefined : { body: reason });
    }

    @OperationID("maintenance/user/count_fixes#create")
    async fixCounts(): Promise<unknown> {
        return this.e621.users.fixCounts();
    }

    @OperationID("users#fix_counts")
    async staffFixCounts(): Promise<unknown> {
        return this.e621.users.staffFixCounts(this.id);
    }

    @OperationID("users#toggle_uploads")
    async toggleUploads(): Promise<string> {
        return this.e621.users.toggleUploads(this.id);
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
