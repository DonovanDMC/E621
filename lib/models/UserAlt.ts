import { Schema } from "../util.js";

import Base from "./Base.js";

import type { UserAlt as UserAltData } from "../generated/types.js";

interface UserAlt extends UserAltData {}
/** @category Models */
@Schema("UserAlt")
class UserAlt extends Base<UserAltData> {}

export default UserAlt;
