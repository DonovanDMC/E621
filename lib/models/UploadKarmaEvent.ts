import { Schema } from "../util.js";

import Base from "./Base.js";

import type { UploadKarmaEvent as UploadKarmaEventData } from "e621-openapi/types";

interface UploadKarmaEvent extends UploadKarmaEventData {}
/** @category Models */
@Schema("UploadKarmaEvent")
class UploadKarmaEvent extends Base<UploadKarmaEventData> {}

export default UploadKarmaEvent;
