import { Schema } from "../util.js";

import Base from "./Base.js";

import type { PostEvent as PostEventData } from "e621-openapi/types";

interface PostEvent extends PostEventData {}
/** @category Models */
@Schema("PostEvent")
class PostEvent extends Base<PostEventData> {}

export default PostEvent;
