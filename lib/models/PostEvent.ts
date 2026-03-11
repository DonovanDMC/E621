import Base from "./Base.js";
import type { PostEvent as PostEventData } from "../generated/types.js";
import { Schema } from "../util.js";

interface PostEvent extends PostEventData {}
/** @category Models */
@Schema("PostEvent")
class PostEvent extends Base<PostEventData> {}

export default PostEvent;
