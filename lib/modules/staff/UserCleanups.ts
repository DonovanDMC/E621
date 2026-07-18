import { staffUserCleanups_clearAvatar, staffUserCleanups_clearProfile, staffUserCleanups_hideBlips, staffUserCleanups_hideComments, staffUserCleanups_hideForumPosts } from "../../generated/sdk.js";
import { OperationID } from "../../util.js";
import Base from "../Base.js";

/** @category Modules */
export default class StaffUserCleanups extends Base {
    @OperationID("staff/user_cleanups#clear_avatar")
    async clearAvatar(id: number): Promise<string> {
        return staffUserCleanups_clearAvatar({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/user_cleanups#clear_profile")
    async clearProfile(id: number): Promise<string> {
        return staffUserCleanups_clearProfile({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/user_cleanups#hide_blips")
    async hideBlips(id: number): Promise<string> {
        return staffUserCleanups_hideBlips({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/user_cleanups#hide_comments")
    async hideComments(id: number): Promise<string> {
        return staffUserCleanups_hideComments({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/user_cleanups#hide_forum_posts")
    async hideForumPosts(id: number): Promise<string> {
        return staffUserCleanups_hideForumPosts({
            client: this.client,
            path: { id },
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }
}
