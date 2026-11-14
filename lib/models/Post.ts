import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { NoV1Options, PostFormatOptions } from "../modules/posts/Format.js";
import type { LegacyPost as PostData } from "e621-openapi/types";

interface Post extends PostData {}
/** @category Models */
@Schema("LegacyPost")
class Post<PF extends PostFormatOptions = NoV1Options> extends PostActions<PostData, PF> {}

export default Post;
