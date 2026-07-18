import { Schema } from "../util.js";

import Base from "./Base.js";

import type { MinimalUser as MinimalUserData } from "../generated/types.js";

interface MinimalUser extends MinimalUserData {}
/** @category Models */
@Schema("MinimalUser")
class MinimalUser extends Base<MinimalUserData> {}

export default MinimalUser;
