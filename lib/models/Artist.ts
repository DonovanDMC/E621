import Base from "./Base.js";
import type ArtistUrl from "./ArtistUrl.js";
import type { Artist as ArtistData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditArtistOptions } from "../modules/Artists.js";

interface Artist extends ArtistData {}
/** @category Models */
@Schema("Artist")
class Artist extends Base<ArtistData> {
    domains: Array<[string, number]> | undefined;
    urls: Array<ArtistUrl> | undefined;

    @OperationID("deleteArtist")
    async delete(): Promise<null> {
        return this.e621.artists.delete(this.id);
    }

    @OperationID("editArtist")
    async edit(options: EditArtistOptions): Promise<null> {
        return this.e621.artists.edit(this.id, options);
    }

    @OperationID("revertArtist")
    async revert(version_id: number): Promise<null> {
        return this.e621.artists.revert(this.id, version_id);
    }
}

export default Artist;
