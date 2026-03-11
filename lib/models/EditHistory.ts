import Base from "./Base.js";
import type { EditHistory as EditHistoryData } from "../generated/types.js";
import { Schema } from "../util.js";

interface EditHistory extends EditHistoryData {}
/** @category Models */
@Schema("EditHistory")
class EditHistory extends Base<EditHistoryData> {}

export default EditHistory;
