import User from "./User.js";
import type { CurrentUser as CurrentUserData } from "../generated/types.js";
import { Schema } from "../util.js";

interface CurrentUser extends CurrentUserData {}
/** @category Models */
@Schema("CurrentUser")
class CurrentUser<D extends CurrentUserData = CurrentUserData> extends User<D> {}

export default CurrentUser;
