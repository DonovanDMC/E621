import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { BasicPost as PostData } from "../generated/types.js";

interface BasicPost extends PostData {}
/** @category Models */
@Schema("BasicPost")
class BasicPost extends PostActions<PostData> {}

export default BasicPost;
