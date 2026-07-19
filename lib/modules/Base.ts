import { UnexpectedResponseError } from "../errors.js";

import type { Client } from "../generated/client/types.js";
import type E621 from "../index.js";
import type { NoV2Options, PostFormatOptions } from "./posts/Format.js";

interface AnyResponse<D = unknown> {
    data?: D;
    error: unknown;
    request?: Request;
    response?: Response;
}
type AnyDataClass<D = unknown, T = unknown> = new (e621: E621, data: D) => T;
type DataType<R extends AnyResponse> = R extends AnyResponse<infer U> ? Exclude<U, undefined> : never;
type UnwrapData<R extends AnyResponse> = DataType<R> extends Array<infer U> ? U : DataType<R>;

/**
 * @category Modules
 *
 * Every concrete subclass must also declare `static readonly moduleKey`, the property name it's attached
 * under on {@link E621} (e.g. `"posts"`) - used by `createStandalone`. TypeScript can't enforce abstract
 * static members, so this is a convention rather than a compiler-checked contract.
 */
export default abstract class Base<PF extends PostFormatOptions = NoV2Options> {
    protected client!: Client;
    protected e621!: E621<PF>;
    /**
     * `e621` may be omitted (pass `undefined`) when constructing a module standalone, without the main
     * {@link E621} client, to keep bundles tree-shakable. Convenience methods on models returned by this
     * module that call back into other modules via `this.e621` will throw in that case.
     */
    constructor(e621: E621<PF> | undefined, client: Client) {
        Object.defineProperties(this, {
            client: { value: client, enumerable: false },
            e621: { value: e621, enumerable: false },
        });
    }

    /** @internal */
    protected _handleResponse<
        R extends AnyResponse,
        S extends number = number,
        T extends boolean = boolean,
        C extends AnyDataClass<UnwrapData<R>> | undefined = undefined,
        CR = C extends AnyDataClass<UnwrapData<R>, infer I> ? I : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(res: R, successStatus: S = 200 as S, throwOnNotFound: T = true as T, klass: C = undefined as C): T extends true ? (S extends 204 ? null : S extends 302 ? string : C extends undefined ? DataType<R> : (DataType<R> extends Array<any> ? Array<CR> : CR)) : (S extends 204 ? null : S extends 302 ? string : (C extends undefined ? DataType<R> : (DataType<R> extends Array<any> ? Array<CR> : CR)) | null) {
        if (res.response?.status === successStatus) {
            if (successStatus === 204) return null as never;
            if (successStatus === 302) return res.response.headers.get("Location") as never;
            else if (res.data === undefined) {
                throw new UnexpectedResponseError(res.request, res.response, res.error);
            } else {
                if (klass) {
                    // klass here is always a plain (non-post-format) model, unrelated to PF - the cast just
                    // satisfies its constructor's bare E621 parameter type.
                    const e621 = this.e621 as unknown as E621;
                    if (Array.isArray(res.data)) return res.data.map(item => new klass(e621, item as UnwrapData<R>)) as never;
                    else return new klass(e621, res.data as UnwrapData<R>) as never;
                } else return res.data as never;
            }
        } else if (res.response?.status === 404 && !throwOnNotFound) return null as never;
        else throw new UnexpectedResponseError(res.request, res.response, res.error);
    }
}
