import { Schema } from "../util.js";

import Base from "./Base.js";

import type { ArtistVersion as ArtistVersionData } from "../generated/types.js";

interface ArtistVersion extends ArtistVersionData {}
/** @category Models */
@Schema("ArtistVersion")
class ArtistVersion extends Base<ArtistVersionData> {}

export default ArtistVersion;
