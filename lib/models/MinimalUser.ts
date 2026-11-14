import { Schema } from "../util.js";

import Base from "./Base.js";

import type { MinimalUser as MinimalUserData } from "e621-openapi/types";

interface MinimalUser extends MinimalUserData {}
/** @category Models */
@Schema("MinimalUser")
class MinimalUser extends Base<MinimalUserData> {}

export default MinimalUser;
