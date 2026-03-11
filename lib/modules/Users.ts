import Base from "./Base.js";
import UsersDMails from "./users/DMails.js";
import {
    clearUserFavorites,
    disableUserUploads,
    fixUserCounts,
    getAvatarMenu,
    getMe,
    getUser,
    getUserUploadLimit,
    searchUsers,
    staffFixUserCounts,
    toggleUserUploads,
    updateUserDmailFilter
} from "../generated/sdk.js";
import type { GetAvatarMenuResponses, User as UserData, SearchUsersData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import User from "../models/User.js";
import FullCurrentUser from "../models/FullCurrentUser.js";
import FullUser from "../models/FullUser.js";

/** @category Modules/Types */
export interface SearchUsersOptions extends TransformDataQueryToOptions<SearchUsersData> {}

/** @category Modules */
export default class Users extends Base {
    dmails = new UsersDMails(this.e621, this.client);
    @OperationID("getAvatarMenu")
    async avatarMenu(): Promise<GetAvatarMenuResponses[200]> {
        return getAvatarMenu({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("clearUserFavorites")
    async clearFavorites(idOrName: string | number): Promise<unknown> {
        return clearUserFavorites({
            client: this.client,
            path:   { idOrName }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("disableUserUploads")
    async disableUploads(idOrName: string | number, body?: string): Promise<unknown> {
        return disableUserUploads({
            client: this.client,
            path:   { idOrName },
            body:   body === undefined ? undefined : { "staff_note[body]": body }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("fixUserCounts")
    async fixCounts(): Promise<unknown> {
        return fixUserCounts({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("getUser")
    async get(idOrName: string | number): Promise<FullUser | FullCurrentUser | null> {
        return getUser({
            client: this.client,
            path:   { idOrName }
        }).then(res => {
            const data = this._handleResponse(res, 200, false);
            if (data === null) return null;
            return "blacklisted_tags" in data ? new FullCurrentUser(this.e621, data) : new FullUser(this.e621, data);
        });
    }

    @OperationID("getMe")
    async me(): Promise<FullCurrentUser> {
        return getMe({
            client: this.client
        }).then(res =>  this._handleResponse(res, 200, true, FullCurrentUser));
    }

    @OperationID("searchUsers")
    async search(options?: SearchUsersOptions): Promise<Array<FullCurrentUser | User>> {
        return searchUsers({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return data.map(user => "blacklisted_tags" in user ? new FullCurrentUser(this.e621, user) : new User(this.e621, user));
        });
    }

    @OperationID("staffFixUserCounts")
    async staffFixCounts(idOrName: string | number): Promise<unknown> {
        return staffFixUserCounts({
            client: this.client,
            path:   { idOrName }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("toggleUserUploads")
    async toggleUploads(idOrName: string | number): Promise<string> {
        return toggleUserUploads({
            client: this.client,
            path:   { idOrName }
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("updateUserDmailFilter")
    async updateDmailFilter(dmail_id: number, words: string): Promise<null> {
        return updateUserDmailFilter({
            client: this.client,
            body:   {
                "dmail_filter[words]": words
            },
            query: {
                dmail_id
            }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getUserUploadLimit")
    async uploadLimit(idOrName: string | number): Promise<User | null> {
        return getUserUploadLimit({
            client: this.client,
            path:   { idOrName }
        }).then(res => this._handleResponse(res, 200, false, User<UserData>));
    }
}
