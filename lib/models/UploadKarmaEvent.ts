import Base from "./Base.js";

import type { UploadKarmaEventsIndexResponses } from "../generated/types.js";

// no `@Schema(...)` here - the spec defines this response inline rather than as a named component schema.
export type UploadKarmaEventData = UploadKarmaEventsIndexResponses[200][number];

interface UploadKarmaEvent extends UploadKarmaEventData {}
/** @category Models */
class UploadKarmaEvent extends Base<UploadKarmaEventData> {}

export default UploadKarmaEvent;
