import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { ThumbnailPost as PostData } from "../generated/types.js";
import type { NoV2Options, PostFormatOptions } from "../modules/posts/Format.js";

interface ThumbnailPost extends PostData {}
/** @category Models */
@Schema("ThumbnailPost")
class ThumbnailPost<PF extends PostFormatOptions = NoV2Options> extends PostActions<PostData, PF> {}

export default ThumbnailPost;
