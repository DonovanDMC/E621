import { Schema } from "../util.js";

import CurrentUser from "./CurrentUser.js";

import type { FullCurrentUser as FullCurrentUserData } from "../generated/types.js";

// technically extends both FullUser and CurrentUser, but that isn't possible in javascript
interface FullCurrentUser extends FullCurrentUserData {}
/** @category Models */
@Schema("FullCurrentUser")
class FullCurrentUser extends CurrentUser<FullCurrentUserData> {}

export default FullCurrentUser;
