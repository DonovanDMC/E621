import { Schema } from "../util.js";

import Base from "./Base.js";

import type { DbExport as DBExportData } from "../generated/types.js";

interface DBExport extends DBExportData {}
/** @category Models */
@Schema("DBExport")
class DBExport extends Base<DBExportData> {}

export default DBExport;
