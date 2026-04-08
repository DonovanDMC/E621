import source from "./generated/source.json" with { type: "json" };

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

/** @category Types */
export type TransformDataQueryToOptions<T extends Record<string, unknown>>
    = T extends { query?: infer Query }
        ? Query extends Record<string, unknown>
            // eslint-disable-next-line @stylistic/indent-binary-ops
            ? {
                [K in RequiredKeys<Query> as TransformNestedKey<K>]: Query[K];
            } & {
                [K in OptionalKeys<Query> as TransformNestedKey<K>]?: Query[K];
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
            }
            : never
        : never;

/** @category Types */
export type PrefixKeys<
    T extends Record<string, unknown>,
    Root extends string,
    Excluded extends keyof T = never,
> = {
    [K in keyof T as K extends Excluded
        ? K
        : `${Root}[${Extract<K, string>}]`]: T[K];
};

export function prefixKeys<
    Root extends string,
    T extends Record<string, unknown>,
    Excluded extends ReadonlyArray<keyof T> = [],
>(obj: T, root: Root, exclude?: Excluded): PrefixKeys<T, Root, Excluded[number]>;
export function prefixKeys<
    Root extends string,
    T extends Record<string, unknown>,
    Excluded extends ReadonlyArray<keyof T> = [],
>(obj: T | undefined, root: Root, exclude?: Excluded): PrefixKeys<T, Root, Excluded[number]> | undefined;
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

const operations = new Set(Object.values(source.paths).flatMap(path => (Object.values(path) as Array<{ operationId: string }>).map(operation => operation.operationId)));
const schemas = new Set(Object.keys(source.components.schemas));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OperationID(value: string): (target: any, propertyKey: string) => void {
    if (!operations.has(value)) {
        throw new Error(`OperationID "${value}" does not exist in the OpenAPI specification.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string): void {
        Object.defineProperty((target as object)[propertyKey as never], "operationID", {
            value,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Schema(value: string): (target: any) => void {
    if (!schemas.has(value)) {
        throw new Error(`Schema "${value}" does not exist in the OpenAPI specification.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any): void {
        Object.defineProperty(target, "schema", {
            value,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    };
}
