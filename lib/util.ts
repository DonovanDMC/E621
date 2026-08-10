/** @category Types */
export type ExtractOrder<T extends { query?: { "search[order]"?: string } }> = ExtractValue<"search[order]", T>;
/** @category Types */
export type ExtractValue<K extends string, T extends { body?: Partial<Record<K, unknown>>; query?: Partial<Record<K, unknown>> }>
    = T["body"] extends undefined ? T["query"] extends undefined ? never
        : Exclude<Exclude<T["query"], undefined>[K], undefined>
        : Exclude<Exclude<T["body"], undefined>[K], undefined>;
/** @category Types */
type TransformNestedKey<T extends string | number | symbol> = T extends `${string}[${infer U}]` ? U : T;

/** @category Types */
type OptionalKeys<T extends object> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/** @category Types */
type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;

/** @category Types */
export type GetResponse<T extends Record<number, unknown>, S extends keyof T> = T[S] extends undefined ? never : T[S];

// Phantom (never assigned a real value, `?:` so nothing at runtime needs to satisfy it) markers that let
// `prefixKeys` recover the *pre-transform* key names (still carrying their "search[...]"/"foo[...]" brackets,
// or lack thereof) from an already-flattened `TransformDataQueryToOptions`/`TransformDataBodyToOptions`
// result, so it can require - at the type level - that every key which *wasn't* bracketed in the spec is
// passed in `exclude`. Two distinct symbols (rather than one shared key) so a type extending both transforms
// (e.g. a combined query+body options interface) doesn't hit "types of property '[X]' are not identical".
declare const RawQueryShape: unique symbol;
declare const RawBodyShape: unique symbol;

/** @category Types */
export type TransformDataQueryToOptions<T extends Record<string, unknown>>
    = T extends { query?: infer Query }
        ? Query extends Record<string, unknown>
            // eslint-disable-next-line @stylistic/indent-binary-ops
            ? {
                [K in RequiredKeys<Query> as TransformNestedKey<K>]: Query[K];
            } & {
                [K in OptionalKeys<Query> as TransformNestedKey<K>]?: Query[K];
            } & {
                readonly [RawQueryShape]?: Query;
            }
            : never
        : never;

/** @category Types */
export type TransformDataBodyToOptions<T extends Record<string, unknown>>
    = T extends { body?: infer Body }
        ? Body extends Record<string, unknown>
            // eslint-disable-next-line @stylistic/indent-binary-ops
            ? {
                [K in RequiredKeys<Body> as TransformNestedKey<K>]: Body[K];
            } & {
                [K in OptionalKeys<Body> as TransformNestedKey<K>]?: Body[K];
            } & {
                readonly [RawBodyShape]?: Body;
            }
            : never
        : never;

/**
 * The pre-transform query/body shape stashed by {@link TransformDataQueryToOptions}/{@link TransformDataBodyToOptions}, if any.
 * Wrapped in `[T]` so this resolves against `T`'s constraint instead of staying deferred when `T` is itself
 * a still-generic type parameter (e.g. a `<const O extends SearchXOptions>` method type param) - see the
 * `IqdbQueries.get` call site, which has to pass a concrete cast for exactly this reason.
 */
type RawShapeOf<T> = [T] extends [{ readonly [RawQueryShape]?: infer Query }]
    ? Query
    : [T] extends [{ readonly [RawBodyShape]?: infer Body }]
            ? Body
            : never;

/** Every key of `Raw` that ISN'T namespaced under `${Root}[...]` - these must be passed to `exclude` untouched, or `prefixKeys` would wrongly nest them too. */
type UnprefixedKeysOf<Raw, Root extends string> = [Raw] extends [Record<string, unknown>]

    ? {
            [K in keyof Raw]-?: K extends `${Root}[${string}]` ? never : TransformNestedKey<K>;
        }[keyof Raw]
    : never;

/** @category Types */
export type PrefixKeys<
    T extends Record<string, unknown>,
    Root extends string,
    Excluded extends keyof T = never,
> = {
    [K in keyof Omit<T, typeof RawQueryShape | typeof RawBodyShape> as K extends Excluded
        ? K
        : `${Root}[${Extract<K, string>}]`]: T[K];
};

/**
 * `Excluded` as-is if it covers every key {@link UnprefixedKeysOf} says it must (order/extras don't matter -
 * e.g. a synthetic client-side-only option can still be excluded even though it isn't in the spec at all);
 * otherwise `never`, which makes the `exclude` argument itself unsatisfiable and fails the call at compile time.
 */
type ValidatedExclude<Required extends PropertyKey, Excluded extends ReadonlyArray<PropertyKey>>
    = [Required] extends [Excluded[number]] ? Excluded : never;

export function prefixKeys<
    Root extends string,
    T extends Record<string, unknown>,
    const Excluded extends ReadonlyArray<keyof T> = [],
>(
    obj: T,
    root: Root,
    ...rest: UnprefixedKeysOf<RawShapeOf<T>, Root> extends never
        ? [exclude?: Excluded]
        : [exclude: ValidatedExclude<UnprefixedKeysOf<RawShapeOf<T>, Root>, Excluded>]
): PrefixKeys<T, Root, Excluded[number]>;
export function prefixKeys<
    Root extends string,
    T extends Record<string, unknown>,
    const Excluded extends ReadonlyArray<keyof T> = [],
>(
    obj: T | undefined,
    root: Root,
    ...rest: UnprefixedKeysOf<RawShapeOf<T>, Root> extends never
        ? [exclude?: Excluded]
        : [exclude: ValidatedExclude<UnprefixedKeysOf<RawShapeOf<T>, Root>, Excluded>]
): PrefixKeys<T, Root, Excluded[number]> | undefined;
export function prefixKeys<
    Root extends string,
    T extends Record<string, unknown>,
    Excluded extends ReadonlyArray<keyof T> = [],
>(obj: T, root: Root, exclude?: Excluded): PrefixKeys<T, Root, Excluded[number]> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (obj === undefined) return undefined;
    const result: Record<string, unknown> = {};
    const excludeSet = new Set(exclude ?? []);

    for (const key of Object.keys(obj)) {
        if (excludeSet.has(key)) {
            result[key] = obj[key];
        } else {
            result[`${root}[${key}]`] = obj[key];
        }
    }

    return result as PrefixKeys<T, Root, Excluded[number]>;
}

// Validated against the OpenAPI spec at build time instead of at runtime (see scripts/replace-openapi.ts) -
// doing it here would require bundling the entire spec (500+KB) into every consumer's build just to check
// a handful of strings once, at class-definition time.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OperationID(value: string): (target: any, propertyKey: string) => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string): void {
        Object.defineProperty((target as object)[propertyKey as never], "OperationID", {
            value,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Schema(value: string): (target: any) => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any): void {
        Object.defineProperty(target, "Schema", {
            value,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    };
}
