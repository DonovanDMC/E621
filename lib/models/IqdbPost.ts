import { type IqdbPost as IqdbPostData } from "../generated/types.js";
import { Schema } from "../util.js";

import Base from "./Base.js";

interface IqdbPost extends IqdbPostData {}
/** @category Models */
@Schema("IqdbPost")
class IqdbPost extends Base<IqdbPostData> {}

export default IqdbPost;
