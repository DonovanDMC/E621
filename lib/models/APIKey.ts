import { Schema } from "../util.js";

import Base from "./Base.js";

import type { APIKey as APIKeyData } from "../generated/types.js";

interface APIKey extends APIKeyData {}
/** @category Models */
@Schema("APIKey")
class APIKey extends Base<APIKeyData> {}

export default APIKey;
