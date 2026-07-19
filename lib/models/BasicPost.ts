import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { BasicPost as PostData } from "../generated/types.js";
import type { NoV2Options, PostFormatOptions } from "../modules/posts/Format.js";

interface BasicPost extends PostData {}
/** @category Models */
@Schema("BasicPost")
class BasicPost<PF extends PostFormatOptions = NoV2Options> extends PostActions<PostData, PF> {}

export default BasicPost;
