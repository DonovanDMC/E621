import { Schema } from "../util.js";

import Base from "./Base.js";

import type { PostDisapproval as PostDisapprovalData } from "e621-openapi/types";

interface PostDisapproval extends PostDisapprovalData {}
/** @category Models */
@Schema("PostDisapproval")
class PostDisapproval extends Base<PostDisapprovalData> {}

export default PostDisapproval;
