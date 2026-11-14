import { Schema } from "../util.js";

import User from "./User.js";

import type { FullUser as FullUserData } from "e621-openapi/types";

interface FullUser extends FullUserData {}
/** @category Models */
@Schema("FullUser")
class FullUser extends User<FullUserData> {}

export default FullUser;
