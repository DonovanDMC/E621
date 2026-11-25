import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UpdateArtistOptions } from "../modules/Artists.js";
import type { Artist as ArtistData } from "e621-openapi/types";

interface Artist extends ArtistData {}
/** @category Models */
@Schema("Artist")
class Artist extends Base<ArtistData> {
    // declared, a class field would reset what Base copied in from the response
    declare domains?: Array<[string, number]>;
    @OperationID("artists#destroy")
    async delete(): Promise<null> {
        return this.e621.artists.delete(this.id);
    }

    @OperationID("artists#revert")
    async revert(version_id: number): Promise<null> {
        return this.e621.artists.revert(this.id, version_id);
    }

    @OperationID("artists#update")
    async update(options: UpdateArtistOptions): Promise<null> {
        return this.e621.artists.update(this.id, options);
    }
}

export default Artist;
