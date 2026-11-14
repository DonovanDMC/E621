import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { NoV1Options, PostFormatOptions } from "../modules/posts/Format.js";
import type { ThumbnailPost as PostData } from "e621-openapi/types";

interface ThumbnailPost extends PostData {}
/** @category Models */
@Schema("ThumbnailPost")
class ThumbnailPost<PF extends PostFormatOptions = NoV1Options> extends PostActions<PostData, PF> {}

export default ThumbnailPost;
