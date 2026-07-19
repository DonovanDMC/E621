import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { ExtendedPost as PostData } from "../generated/types.js";
import type { NoV2Options, PostFormatOptions } from "../modules/posts/Format.js";

interface ExtendedPost extends PostData {}
/** @category Models */
@Schema("ExtendedPost")
class ExtendedPost<PF extends PostFormatOptions = NoV2Options> extends PostActions<PostData, PF> {}

export default ExtendedPost;
