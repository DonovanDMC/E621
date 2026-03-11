import User from "./User.js";
import type { FullUser as FullUserData } from "../generated/types.js";
import { Schema } from "../util.js";

interface FullUser extends FullUserData {}
/** @category Models */
@Schema("FullUser")
class FullUser extends User<FullUserData> {}

export default FullUser;
