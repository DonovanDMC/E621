import { Schema } from "../util.js";

import Base from "./Base.js";

import type { ModAction as ModActionData, ModActionAction } from "e621-openapi/types";

/**
 * The variant of {@link ModActionData} for a specific action, with `values` typed for it.
 *
 * @category Models
 */
export type ModActionVariant<A extends ModActionAction> = ModActionData extends infer M
    ? M extends { action: infer MA } ? A extends MA ? M : never : never
    : never;

// ModActionData is a union keyed by `action`, which an interface can't extend directly
interface ModAction extends Pick<ModActionData, keyof ModActionData> {}
/** @category Models */
@Schema("ModAction")
class ModAction extends Base<ModActionData> {
    /**
     * Check the action, narrowing `values` to the keys logged for it.
     *
     * @example
     * if (modAction.is("artist_delete")) modAction.values.artist_name; // string | undefined
     */
    is<A extends ModActionAction>(action: A): this is this & ModActionVariant<A> {
        return this.action === action;
    }
}

export default ModAction;
