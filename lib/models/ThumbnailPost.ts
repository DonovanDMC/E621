import { Schema } from "../util.js";

import PostActions from "./posts/Actions.js";

import type { ThumbnailPost as PostData } from "../generated/types.js";

interface ThumbnailPost extends PostData {}
/** @category Models */
@Schema("ThumbnailPost")
class ThumbnailPost extends PostActions<PostData> {}

export default ThumbnailPost;
