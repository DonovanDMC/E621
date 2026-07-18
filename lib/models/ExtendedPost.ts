import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { ExtendedPost as PostData } from "../generated/types.js";

interface ExtendedPost extends PostData {}
/** @category Models */
@Schema("ExtendedPost")
class ExtendedPost extends PostActions<PostData> {}

export default ExtendedPost;
