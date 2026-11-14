import { Schema } from "../util.js";

import Base from "./Base.js";

import type { ArtistURL as ArtistURLData } from "e621-openapi/types";

interface ArtistURL extends ArtistURLData {}
/** @category Models */
@Schema("ArtistURL")
class ArtistURL extends Base<ArtistURLData> {}

export default ArtistURL;
