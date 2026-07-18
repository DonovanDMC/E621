import { OperationID, Schema } from "../util.js";

import User from "./User.js";

import type { CurrentUser as CurrentUserData } from "../generated/types.js";
import type { UpdateAvatarCropOptions, UpdateCurrentUserOptions, UsersAvatarMenuResponse } from "../modules/Users.js";

interface CurrentUser extends Omit<CurrentUserData, "last_logged_in_at"> {}
/** @category Models */
@Schema("CurrentUser")
class CurrentUser<D extends CurrentUserData = CurrentUserData> extends User<D> {
    /**
     * Narrowed from {@link User.last_logged_in_at} - always present for the current user.
     */
    declare last_logged_in_at: string;

    @OperationID("users#avatar_menu")
    async avatarMenu(): Promise<UsersAvatarMenuResponse> {
        return this.e621.users.avatarMenu();
    }

    @OperationID("users#update")
    async update(options: UpdateCurrentUserOptions): Promise<null> {
        return this.e621.users.update(this.id, options);
    }

    @OperationID("maintenance/user/avatars#update")
    async updateAvatarCrop(options: UpdateAvatarCropOptions): Promise<string> {
        return this.e621.users.updateAvatarCrop(options);
    }
}

export default CurrentUser;
