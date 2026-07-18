import {
    users_flushFavorites,
    users_disableUploads,
    maintenanceUserCountFixes_create,
    users_avatarMenu,
    users_me,
    users_show,
    users_uploadLimit,
    users_index,
    users_fixCounts,
    users_toggleUploads,
    maintenanceUserAvatars_update,
    maintenanceUserDmailFilters_update,
    users_update,
} from "../generated/sdk.js";
import FullCurrentUser from "../models/FullCurrentUser.js";
import FullUser from "../models/FullUser.js";
import User from "../models/User.js";
import { GetResponse, OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { UsersAvatarMenuResponses, UsersIndexData, MaintenanceUserAvatarsUpdateData, UsersUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchUsersOptions extends TransformDataQueryToOptions<UsersIndexData> {}
/** @category Modules/Types */
export interface UsersAvatarMenuResponse extends GetResponse<UsersAvatarMenuResponses, 200> {}
/** @category Modules/Types */
export interface UpdateAvatarCropOptions extends TransformDataBodyToOptions<MaintenanceUserAvatarsUpdateData> {}
/**
 * The spec's `dmail_filter_attributes` keys are malformed (missing an opening bracket) - use {@link Users.updateDmailFilter} or {@link DMail.updateFilter} instead.
 *
 * @category Modules/Types
 */
export interface UpdateCurrentUserOptions extends Omit<TransformDataBodyToOptions<UsersUpdateData>, "id" | "words"> {}

/** @category Modules */
export default class Users extends Base {
    static readonly moduleKey = "users" as const;
    @OperationID("users#avatar_menu")
    async avatarMenu(): Promise<UsersAvatarMenuResponse> {
        return users_avatarMenu({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("users#flush_favorites")
    async clearFavorites(idOrName: string | number): Promise<string> {
        return users_flushFavorites({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("users#disable_uploads")
    async disableUploads(idOrName: string | number, body?: string): Promise<string> {
        return users_disableUploads({
            client: this.client,
            path: { idOrName },
            body: body === undefined ? undefined : { body },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("maintenance/user/count_fixes#create")
    async fixCounts(): Promise<string> {
        return maintenanceUserCountFixes_create({
            client: this.client,
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("users#show")
    async get(idOrName: string | number): Promise<FullUser | FullCurrentUser | null> {
        return users_show({
            client: this.client,
            path: { idOrName },
        }).then((res) => {
            const data = this._handleResponse(res, 200, false);
            if (data === null) return null;
            return "blacklisted_tags" in data ? new FullCurrentUser(this.e621, data) : new FullUser(this.e621, data);
        });
    }

    @OperationID("users#me")
    async me(): Promise<FullCurrentUser> {
        return users_me({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, FullCurrentUser));
    }

    @OperationID("users#index")
    async search(options?: SearchUsersOptions): Promise<Array<FullCurrentUser | User>> {
        return users_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(user => "blacklisted_tags" in user ? new FullCurrentUser(this.e621, user) : new User(this.e621, user));
        });
    }

    @OperationID("users#fix_counts")
    async staffFixCounts(idOrName: string | number): Promise<string> {
        return users_fixCounts({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("users#toggle_uploads")
    async toggleUploads(idOrName: string | number): Promise<string> {
        return users_toggleUploads({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("users#update")
    async update(idOrName: string | number, options: UpdateCurrentUserOptions): Promise<null> {
        return users_update({
            client: this.client,
            path: { idOrName },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("maintenance/user/avatars#update")
    async updateAvatarCrop(options: UpdateAvatarCropOptions): Promise<string> {
        return maintenanceUserAvatars_update({
            client: this.client,
            body: options,
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("maintenance/user/dmail_filters#update")
    async updateDmailFilter(dmail_id: number, words: string): Promise<null> {
        return maintenanceUserDmailFilters_update({
            client: this.client,
            body: { words },
            query: {
                dmail_id,
            },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("users#upload_limit")
    async uploadLimit(idOrName: string | number): Promise<FullCurrentUser | FullUser | null> {
        return users_uploadLimit({
            client: this.client,
            path: { idOrName },
        }).then((res) => {
            const data = this._handleResponse(res, 200, false);
            return data === null ? null : "blacklisted_tags" in data ? new FullCurrentUser(this.e621, data) : new FullUser(this.e621, data);
        });
    }
}
