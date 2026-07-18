import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Ticket as TicketData } from "../generated/types.js";
import type { UpdateTicketOptions } from "../modules/Tickets.js";

interface Ticket extends TicketData {}
/** @category Models */
@Schema("Ticket")
class Ticket extends Base<TicketData> {
    @OperationID("tickets#claim")
    async claim(): Promise<Ticket> {
        return this.e621.tickets.claim(this.id);
    }

    @OperationID("tickets#unclaim")
    async unclaim(): Promise<Ticket> {
        return this.e621.tickets.unclaim(this.id);
    }

    @OperationID("tickets#update")
    async update(options: UpdateTicketOptions): Promise<null> {
        return this.e621.tickets.update(this.id, options);
    }
}

export default Ticket;
