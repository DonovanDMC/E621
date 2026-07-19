import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { LegacyPost as PostData } from "../generated/types.js";
import type { NoV2Options, PostFormatOptions } from "../modules/posts/Format.js";

interface Post extends PostData {}
/** @category Models */
@Schema("LegacyPost")
class Post<PF extends PostFormatOptions = NoV2Options> extends PostActions<PostData, PF> {}

export default Post;
