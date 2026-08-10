import { Schema } from "../util.js";

import Base from "./Base.js";

import type { ArtistURL as ArtistURLData } from "../generated/types.js";

interface ArtistURL extends ArtistURLData {}
/** @category Models */
@Schema("ArtistURL")
class ArtistURL extends Base<ArtistURLData> {}

export default ArtistURL;
