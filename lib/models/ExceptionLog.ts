import { Schema } from "../util.js";

import Base from "./Base.js";

import type { ExceptionLog as ExceptionLogData } from "e621-openapi/types";

interface ExceptionLog extends ExceptionLogData {}
/** @category Models */
@Schema("ExceptionLog")
class ExceptionLog extends Base<ExceptionLogData> {}

export default ExceptionLog;
