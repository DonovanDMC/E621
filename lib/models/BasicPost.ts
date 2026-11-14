import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { NoV1Options, PostFormatOptions } from "../modules/posts/Format.js";
import type { BasicPost as PostData } from "e621-openapi/types";

interface BasicPost extends PostData {}
/** @category Models */
@Schema("BasicPost")
class BasicPost<PF extends PostFormatOptions = NoV1Options> extends PostActions<PostData, PF> {}

export default BasicPost;
