import { auditUserDMail, auditUserDMails } from "../../generated/sdk.js";
import DMail from "../../models/DMail.js";
import { OperationID } from "../../util.js";
import Base from "../Base.js";

/** @category Modules */
export default class UsersDMails extends Base {
    @OperationID("auditUserDMail")
    async get(user_id: number, id: number): Promise<DMail | null> {
        return auditUserDMail({
            client: this.client,
            path:   { id, user_id }
        }).then(res => this._handleResponse(res, 200, false, DMail));
    }

    @OperationID("auditUserDMails")
    async search(user_id: number): Promise<Array<DMail>> {
        return auditUserDMails({
            client: this.client,
            path:   { user_id }
        }).then(res => this._handleResponse(res, 200, true, DMail));
    }
}
