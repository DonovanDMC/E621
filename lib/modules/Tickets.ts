import {
    tickets_claim,
    tickets_update,
    tickets_show,
    tickets_index,
    tickets_unclaim,
} from "../generated/sdk.js";
import Ticket from "../models/Ticket.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { TicketsUpdateData, TicketsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface UpdateTicketOptions extends TransformDataBodyToOptions<TicketsUpdateData> {}
/** @category Modules/Types */
export interface SearchTicketsOptions extends TransformDataQueryToOptions<TicketsIndexData> {}

/** @category Modules */
export default class Tickets extends Base {
    static readonly moduleKey = "tickets" as const;
    @OperationID("tickets#claim")
    async claim(id: number): Promise<Ticket> {
        return tickets_claim({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Ticket));
    }

    @OperationID("tickets#show")
    async get(id: number): Promise<Ticket | null> {
        return tickets_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Ticket));
    }

    @OperationID("tickets#index")
    async search(options?: SearchTicketsOptions): Promise<Array<Ticket>> {
        return tickets_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Ticket));
    }

    @OperationID("tickets#unclaim")
    async unclaim(id: number): Promise<Ticket> {
        return tickets_unclaim({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Ticket));
    }

    @OperationID("tickets#update")
    async update(id: number, options: UpdateTicketOptions): Promise<null> {
        return tickets_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
