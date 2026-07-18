import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type ArtistUrl from "./ArtistUrl.js";
import type { Artist as ArtistData } from "../generated/types.js";
import type { UpdateArtistOptions } from "../modules/Artists.js";

interface Artist extends ArtistData {}
/** @category Models */
@Schema("Artist")
class Artist extends Base<ArtistData> {
    domains: Array<[string, number]> | undefined; urls: Array<ArtistUrl> | undefined;
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
