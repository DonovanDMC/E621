import { Schema } from "../util.js";

import Base from "./Base.js";

import type { Upload as UploadData } from "../generated/types.js";

interface Upload extends UploadData {}
/** @category Models */
@Schema("Upload")
class Upload extends Base<UploadData> {}

export default Upload;
