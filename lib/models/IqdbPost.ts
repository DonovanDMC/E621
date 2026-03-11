import Base from "./Base.js";
import { type IqdbPost as IqdbPostData } from "../generated/types.js";
import { Schema } from "../util.js";

interface IqdbPost extends IqdbPostData {}
/** @category Models */
@Schema("IqdbPost")
class IqdbPost extends Base<IqdbPostData> {}

export default IqdbPost;
