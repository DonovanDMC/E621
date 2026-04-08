import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Ticket as TicketData } from "../generated/types.js";
import type { EditTicketOptions } from "../modules/Tickets.js";

interface Ticket extends TicketData {}
/** @category Models */
@Schema("Ticket")
class Ticket extends Base<TicketData> {
    @OperationID("claimTicket")
    async claim(): Promise<Ticket> {
        return this.e621.tickets.claim(this.id);
    }

    @OperationID("editTicket")
    async edit(options: EditTicketOptions): Promise<null> {
        return this.e621.tickets.edit(this.id, options);
    }

    @OperationID("unclaimTicket")
    async unclaim(): Promise<Ticket> {
        return this.e621.tickets.unclaim(this.id);
    }
}

export default Ticket;
