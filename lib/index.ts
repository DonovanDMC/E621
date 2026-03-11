import { createClient } from "./generated/client/client.js";
import type { Client, Config } from "./generated/client/types.js";
import { createConfig } from "./generated/client/utils.js";
import { apply, type Modules } from "./modules/index.js";
import Debug from "./Debug.js";
import pkg from "../package.json" with { type: "json" };

export type * from "./modules/index.js";
export * from "./models/index.js";
export * from "./errors.js";
export * as Generated from "./generated.js";

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
interface InstanceOptions {
    authKey: string | null;
    authUser: string | null;
    baseURL: string;
    requestTimeout: number;
    statusCheckURL: string;
    userAgent: string;
}

interface E621 extends Modules {}
/** @category Main */
class E621 {
    client: Client;
    options: InstanceOptions;
    constructor(options?: Options) {
        this.options = {
            authKey:        options?.authKey ?? null,
            authUser:       options?.authUser ?? null,
            baseURL:        options?.baseURL ?? "https://e621.net",
            requestTimeout: options?.requestTimeout ?? 30,
            statusCheckURL: options?.statusCheckURL ?? "https://status.e621.church/json",
            userAgent:      options?.userAgent ?? `E621/${pkg.version} (https://github.com/DonovanDMC/E621${options?.authUser ? `; "${options.authUser}"` : ""})`
        };
        let config: Config;
        const commonConfig: Partial<Parameters<typeof createConfig>[0]> = {
            baseUrl: this.options.baseURL,
            headers: {
                "User-Agent": this.options.userAgent
            },
            fetch: async(input, init): Promise<Response> => {
                let url = "unknown", method = "unknown";
                // for some reason it doesn't seem to be inserting the Authorization header
                if (input instanceof Request) {
                    url = input.url;
                    method = input.method.toLowerCase();
                    if (!input.headers.has("Auithorization") && this.options.authKey && this.options.authUser) {
                        input.headers.set("Authorization", `Basic ${btoa(`${this.options.authUser}:${this.options.authKey}`)}`);
                    }
                } else if (init) {
                    url = input.toString();
                    method = init.method?.toLowerCase() ?? "get";
                    if (this.options.authKey && this.options.authUser) {
                        const headers = new Headers(init.headers);
                        if (!headers.has("Authorization")) {
                            headers.set("Authorization", `Basic ${btoa(`${this.options.authUser}:${this.options.authKey}`)}`);
                        }
                        init.headers = headers;
                    }
                }
                Debug(`request:${method}`, `-> ${url}`);
                const res = await fetch(input, init);
                Debug(`response:${method}`, `<- ${url} ${res.status} ${res.statusText}`);
                return res;
            }
        };
        if (options?.authKey && options?.authUser) {
            config = createConfig({
                ...commonConfig,
                auth: auth => {
                    if (auth.scheme === "basic") {
                        return `${this.options.authUser}:${this.options.authKey}`;
                    }

                    return;
                }
            });
        } else {
            config = createConfig(commonConfig);
        }
        this.client = createClient(config);
        apply(this, this.client);
    }
}

export default E621;
