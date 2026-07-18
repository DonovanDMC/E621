import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { LegacyPost as PostData } from "../generated/types.js";

interface Post extends PostData {}
/** @category Models */
@Schema("LegacyPost")
class Post extends PostActions<PostData> {}

export default Post;
