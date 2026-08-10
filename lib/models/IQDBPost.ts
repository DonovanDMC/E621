import { type IQDBPost as IQDBPostData } from "../generated/types.js";
import { Schema } from "../util.js";

import Base from "./Base.js";

interface IQDBPost extends IQDBPostData {}
/** @category Models */
@Schema("IQDBPost")
class IQDBPost extends Base<IQDBPostData> {}

export default IQDBPost;
