import Base from "./Base.js";
import type { ArtistVersion as ArtistVersionData } from "../generated/types.js";
import { Schema } from "../util.js";

interface ArtistVersion extends ArtistVersionData {}
/** @category Models */
@Schema("ArtistVersion")
class ArtistVersion extends Base<ArtistVersionData> {}

export default ArtistVersion;
