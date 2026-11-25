import { Schema } from "../util.js";

import Base from "./Base.js";

import type { UploadURLRule as UploadURLRuleData } from "e621-openapi/types";

interface UploadURLRule extends UploadURLRuleData {}
/** @category Models */
@Schema("UploadURLRule")
class UploadURLRule extends Base<UploadURLRuleData> {}

export default UploadURLRule;
