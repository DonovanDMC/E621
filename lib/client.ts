import Debug from "./Debug.js";
import { createClient } from "./generated/client/client.js";
import { createConfig } from "./generated/client/utils.js";
import { VERSION } from "./version.js";

import type { Client, Config } from "./generated/client/types.js";

/** @category Main */
export interface Options {
    /**
     * The api key you want to authenticate with (Account -> Manage API Access)
     * @default none
     */
    authKey?: string;
    /**
     * The uername of the user you want to authenticate with
     * @default none
     */
    authUser?: string;
    /**
     * The base URL for the API.
     * @default https://e621.net
     */
    baseURL?: string;
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
}

/** @category Main */
export interface InstanceOptions {
    authKey: string | null;
    authUser: string | null;
    baseURL: string;
    requestTimeout: number;
    statusCheckURL: string;
    userAgent: string;
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
export function createE621Client(options?: Options): E621ClientResult {
    const resolved: InstanceOptions = {
        authKey: options?.authKey ?? null,
        authUser: options?.authUser ?? null,
        baseURL: options?.baseURL ?? "https://e621.net",
        requestTimeout: options?.requestTimeout ?? 30,
        statusCheckURL: options?.statusCheckURL ?? "https://status.e621.church/json",
        userAgent: options?.userAgent ?? `E621/${VERSION} (https://github.com/DonovanDMC/E621${options?.authUser ? `; "${options.authUser}"` : ""})`,
    };
    let config: Config;
    const commonConfig: Partial<Parameters<typeof createConfig>[0]> = {
        baseUrl: resolved.baseURL,
        headers: {
            "User-Agent": resolved.userAgent,
        },
        fetch: async (input, init): Promise<Response> => {
            let url = "unknown", method = "unknown";
            // for some reason it doesn't seem to be inserting the Authorization header
            if (input instanceof Request) {
                url = input.url;
                method = input.method.toLowerCase();
                if (!input.headers.has("Auithorization") && resolved.authKey && resolved.authUser) {
                    input.headers.set("Authorization", `Basic ${btoa(`${resolved.authUser}:${resolved.authKey}`)}`);
                }
            } else if (init) {
                url = input.toString();
                method = init.method?.toLowerCase() ?? "get";
                if (resolved.authKey && resolved.authUser) {
                    const headers = new Headers(init.headers);
                    if (!headers.has("Authorization")) {
                        headers.set("Authorization", `Basic ${btoa(`${resolved.authUser}:${resolved.authKey}`)}`);
                    }
                    init.headers = headers;
                }
            }
            Debug(`request:${method}`, `-> ${url}`);
            const res = await fetch(input, init);
            Debug(`response:${method}`, `<- ${url} ${res.status} ${res.statusText}`);
            return res;
        },
    };
    if (resolved.authKey && resolved.authUser) {
        config = createConfig({
            ...commonConfig,
            auth: (auth) => {
                if (auth.scheme === "basic") {
                    return `${resolved.authUser}:${resolved.authKey}`;
                }

                return;
            },
        });
    } else {
        config = createConfig(commonConfig);
    }

    return { client: createClient(config), options: resolved };
}
