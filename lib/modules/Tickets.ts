import Base from "./Base.js";
import {
    claimTicket,
    editTicket,
    getTicket,
    searchTickets,
    unclaimTicket
} from "../generated/sdk.js";
import type { EditTicketData, SearchTicketsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import Ticket from "../models/Ticket.js";

/** @category Modules/Types */
export interface EditTicketOptions extends TransformDataBodyToOptions<EditTicketData> {}
/** @category Modules/Types */
export interface SearchTicketsOptions extends TransformDataQueryToOptions<SearchTicketsData> {}

/** @category Modules */
export default class Tickets extends Base {
    @OperationID("claimTicket")
    async claim(id: number): Promise<Ticket> {
        return claimTicket({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, Ticket));
    }

    @OperationID("editTicket")
    async edit(id: number, options: EditTicketOptions): Promise<null> {
        return editTicket({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "ticket")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getTicket")
    async get(id: number): Promise<Ticket | null> {
        return getTicket({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, Ticket));
    }

    @OperationID("searchTickets")
    async search(options?: SearchTicketsOptions): Promise<Array<Ticket>> {
        return searchTickets({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, Ticket));
    }

    @OperationID("unclaimTicket")
    async unclaim(id: number): Promise<Ticket> {
        return unclaimTicket({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, Ticket));
    }
}
