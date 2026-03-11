import Base from "./Base.js";
import type { ApiKey as ApiKeyData } from "../generated/types.js";
import { Schema } from "../util.js";

interface ApiKey extends ApiKeyData {}
/** @category Models */
@Schema("ApiKey")
class ApiKey extends Base<ApiKeyData> {}

export default ApiKey;
