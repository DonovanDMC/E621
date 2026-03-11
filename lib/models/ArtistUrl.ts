import Base from "./Base.js";
import type { ArtistUrl as ArtistUrlData } from "../generated/types.js";
import { Schema } from "../util.js";

interface ArtistUrl extends ArtistUrlData {}
/** @category Models */
@Schema("ArtistUrl")
class ArtistUrl extends Base<ArtistUrlData> {}

export default ArtistUrl;
