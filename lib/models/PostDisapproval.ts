import Base from "./Base.js";
import type { PostDisapproval as PostDisapprovalData } from "../generated/types.js";
import { Schema } from "../util.js";

interface PostDisapproval extends PostDisapprovalData {}
/** @category Models */
@Schema("PostDisapproval")
class PostDisapproval extends Base<PostDisapprovalData> {}

export default PostDisapproval;
