import { createClient } from "e621-openapi/client/client";
import { createConfig } from "e621-openapi/client/utils";

import Debug from "./Debug.js";
import { parseRetryAfter } from "./errors.js";
import { VERSION } from "./version.js";

import type { NoV1Options, PostFormatOptions } from "./modules/posts/Format.js";
import type { Client, Config } from "e621-openapi/client/types";

/** @category Main */
export interface RatelimitInfo {
    /** The 1-indexed attempt that just got rate limited. */
    attempt: number;
    /** The configured {@link RatelimitOptions.maxRetries}, for context. */
    maxRetries: number;
    request: Request;
    response: Response;
    /** Seconds parsed from the response's `Retry-After` header - `null` if missing/unparsable. */
    retryAfter: number | null;
    /** Whether this request will be retried, or is about to fail with a {@link RatelimitError}. */
    willRetry: boolean;
}

/** @category Main */
export interface RatelimitOptions {
    /**
     * The maximum number of times to retry a rate limited (HTTP 429) request before giving up and
     * throwing a {@link RatelimitError}.
     * @default 3
     */
    maxRetries?: number;
    /**
     * The maximum delay, in seconds, to wait before retrying, regardless of what the `Retry-After` header
     * says or how many attempts have been made.
     * @default 60
     */
    maxRetryDelay?: number;
    /**
     * Called every time a request gets rate limited, before the retry delay (or before throwing, if
     * retries are exhausted or disabled). Useful for logging/metrics.
     * @default none
     */
    onRatelimit?: (info: RatelimitInfo) => void;
    /**
     * Whether to automatically retry requests that get rate limited (HTTP 429), waiting for the duration
     * in the response's `Retry-After` header (or `retryDelay`, backed off exponentially per attempt, if
     * the header is missing or unusable) before retrying.
     * @default true
     */
    retry?: boolean;
    /**
     * The delay, in seconds, to wait before retrying a rate limited request when the response has no (or
     * an unusable) `Retry-After` header. Doubled per attempt (capped at `maxRetryDelay`).
     * @default 1
     */
    retryDelay?: number;
}

/**
 * A bearer token, or a function returning one (e.g. {@link OAuthClient.getAccessToken}, to refresh tokens
 * as they expire). Returning `null`/`undefined` sends the request without bearer auth.
 * @category Main
 */
export type AuthToken = string | (() => string | null | undefined | Promise<string | null | undefined>);

/** @category Main */
export interface Options<PF extends PostFormatOptions = NoV1Options> {
    /**
     * The api key you want to authenticate with (Account -> Manage API Access)
     * @default none
     */
    authKey?: string;
    /**
     * A bearer token (such as an OAuth access token) to authenticate with, or a function that returns one.
     * Takes priority over {@link Options.authUser}/{@link Options.authKey} when both are provided.
     * @default none
     */
    authToken?: AuthToken;
    /**
     * The username of the user you want to authenticate with
     * @default none
     */
    authUser?: string;
    /**
     * The base URL for the API.
     * @default https://e621.net
     */
    baseURL?: string;
    /**
     * The v1/mode format every post-returning method across the lib falls back to when called without
     * explicit `v1`/`mode` options (e.g. `posts.get()`, `posts.search()`, `favorites.search()`,
     * `popular.get()`, `iqdbQueries.get()`/`.post()`, and convenience methods on returned post models like
     * `post.update()`). Per-call options still take priority over this.
     * @default basic (v1: false)
     */
    defaultPostFormat?: PF;
    /**
     * Controls how rate limited (HTTP 429) requests are retried.
     * @default \{ retry: true, maxRetries: 3, retryDelay: 1, maxRetryDelay: 60 \}
     */
    ratelimit?: RatelimitOptions;
    /**
     * The number of seconds before a request times out
     * @default 30
     */
    requestTimeout?: number;
    /**
     * The url to use for status checks.
     * @default https://status.e621.church/json
     */
    statusCheckURL?: string;
    /**
     * The user agent to use for requests
     * @defaultWithoutAuthentication E621/\{version\} (+https://github.com/DonovanDMC/E621)
     * @defaultWithAuthentication E621/\{version\} (+https://github.com/DonovanDMC/E621; \{authUser\})
     */
    userAgent?: string;
    /**
     * Whether to send the user agent in the `_client` query parameter instead of the User-Agent header.
     * This is useful in browsers, where setting the User-Agent header is not allowed.
     * @default false in Node.js, true in browsers
     */
    userAgentInQuery?: boolean;
}

/** @category Main */
export interface ResolvedRatelimitOptions {
    maxRetries: number;
    maxRetryDelay: number;
    onRatelimit?: (info: RatelimitInfo) => void;
    retry: boolean;
    retryDelay: number;
}

/** @category Main */
export interface InstanceOptions {
    authKey: string | null;
    authToken: AuthToken | null;
    authUser: string | null;
    baseURL: string;
    ratelimit: ResolvedRatelimitOptions;
    requestTimeout: number;
    statusCheckURL: string;
    userAgent: string;
    userAgentInQuery: boolean;
}

/** @category Main */
export interface E621ClientResult {
    client: Client;
    options: InstanceOptions;
}

/**
 * Builds the generated API {@link Client} and resolved {@link InstanceOptions} used by the main {@link E621}
 * class, handling auth header injection, the default user agent, and request/response {@link Debug} logging.
 *
 * Exposed standalone (see `e621/standalone`) so modules can be constructed directly, without the full
 * {@link E621} client, when bundle size matters more than convenience.
 *
 * @category Main
 */
export function createE621Client<const PF extends PostFormatOptions = NoV1Options>(options?: Options<PF>): E621ClientResult {
    const resolved: InstanceOptions = {
        authKey: options?.authKey ?? null,
        authToken: options?.authToken ?? null,
        authUser: options?.authUser ?? null,
        baseURL: options?.baseURL ?? "https://e621.net",
        ratelimit: {
            maxRetries: options?.ratelimit?.maxRetries ?? 3,
            maxRetryDelay: options?.ratelimit?.maxRetryDelay ?? 60,
            onRatelimit: options?.ratelimit?.onRatelimit,
            retry: options?.ratelimit?.retry ?? true,
            retryDelay: options?.ratelimit?.retryDelay ?? 1,
        },
        requestTimeout: options?.requestTimeout ?? 30,
        statusCheckURL: options?.statusCheckURL ?? "https://status.e621.church/json",
        userAgent: options?.userAgent ?? `E621/${VERSION} (https://github.com/DonovanDMC/E621${options?.authUser ? `; "${options.authUser}"` : ""})`,
        userAgentInQuery: options?.userAgentInQuery ?? "window" in globalThis,
    };
    // read at request time, so changing options.authToken etc. after construction still takes effect
    const getAuthorization = async (): Promise<string | null> => {
        if (resolved.authToken) {
            const token = typeof resolved.authToken === "function" ? await resolved.authToken() : resolved.authToken;
            if (token) return `Bearer ${token}`;
        }
        if (resolved.authKey && resolved.authUser) return `Basic ${btoa(`${resolved.authUser}:${resolved.authKey}`)}`;
        return null;
    };
    const config: Config = createConfig({
        baseUrl: resolved.baseURL,
        headers: resolved.userAgentInQuery ? undefined : {
            "User-Agent": resolved.userAgent,
        },
        fetch: async (input, init): Promise<Response> => {
            let url = "unknown", method = "unknown";
            // the generated client only inserts auth for operations with a matching security scheme, so it's done here instead
            if (input instanceof Request) {
                url = input.url;
                method = input.method.toLowerCase();
                if (!input.headers.has("Authorization")) {
                    const authorization = await getAuthorization();
                    if (authorization) input.headers.set("Authorization", authorization);
                }
            } else if (init) {
                url = input.toString();
                method = init.method?.toLowerCase() ?? "get";
                const headers = new Headers(init.headers);
                if (!headers.has("Authorization")) {
                    const authorization = await getAuthorization();
                    if (authorization) headers.set("Authorization", authorization);
                }
                init.headers = headers;
            }
            if (resolved.userAgentInQuery && input instanceof Request) {
                const requestURL = new URL(input.url);
                requestURL.searchParams.set("_client", resolved.userAgent);
                input = new Request(requestURL, input);
                url = requestURL.toString();
            }
            Debug(`request:${method}`, `-> ${url}`);
            let attempt = 0, res: Response;
            for (;;) {
                // clone so a retry can re-send the body - `input` itself is never fetched directly, so it's
                // never disturbed and can be cloned again on the next attempt
                res = await fetch(input instanceof Request ? input.clone() : input, init);
                Debug(`response:${method}`, `<- ${url} ${res.status} ${res.statusText}`);
                if (res.status !== 429) break;
                const retryAfter = parseRetryAfter(res);
                const willRetry = resolved.ratelimit.retry && attempt < resolved.ratelimit.maxRetries;
                resolved.ratelimit.onRatelimit?.({
                    attempt: attempt + 1,
                    maxRetries: resolved.ratelimit.maxRetries,
                    request: input instanceof Request ? input : new Request(url, init),
                    response: res,
                    retryAfter,
                    willRetry,
                });
                if (!willRetry) break;
                const delay = Math.min(retryAfter ?? resolved.ratelimit.retryDelay * 2 ** attempt, resolved.ratelimit.maxRetryDelay);
                Debug(`response:${method}`, `<- ${url} ratelimited, retrying in ${delay}s (attempt ${attempt + 1}/${resolved.ratelimit.maxRetries})`);
                // free the connection, the body of a response we're discarding is never read
                await res.body?.cancel().catch(() => {});
                await new Promise(resolve => setTimeout(resolve, delay * 1000));
                attempt++;
            }
            return res;
        },
    });

    return { client: createClient(config), options: resolved };
}
