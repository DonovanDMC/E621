import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { after, before, beforeEach, describe, it } from "node:test";

import E621, { OAuthCallbackError, OAuthClient } from "../dist/lib/index.js";

import type { Generated } from "../dist/lib/index.js";

let requests: Array<Request>;
let responses: Array<Response>;
const originalFetch = globalThis.fetch;

before(() => {
    globalThis.fetch = ((input: Request) => {
        requests.push(input);
        return Promise.resolve(responses.shift() ?? json({ post: { id: 1, tags: "tag1" } }));
    }) as typeof fetch;
});

after(() => {
    globalThis.fetch = originalFetch;
});

beforeEach(() => {
    requests = [];
    responses = [];
});

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function token(overrides: Partial<Generated.OAuthToken> = {}): Generated.OAuthToken {
    return {
        access_token:  "access",
        token_type:    "Bearer",
        expires_in:    7200,
        refresh_token: "refresh",
        scope:         "openid full",
        created_at:    Math.floor(Date.now() / 1000),
        ...overrides,
    };
}

describe("bearer auth", () => {
    it("sends a static bearer token", async () => {
        const e621 = new E621({ authToken: "abc" });
        await e621.posts.get(1);
        assert.equal(requests[0]?.headers.get("Authorization"), "Bearer abc");
    });

    it("calls a token function for every request", async () => {
        let n = 0;
        const e621 = new E621({ authToken: async () => `tok${++n}` });
        await e621.posts.get(1);
        await e621.posts.get(1);
        assert.equal(requests[0]?.headers.get("Authorization"), "Bearer tok1");
        assert.equal(requests[1]?.headers.get("Authorization"), "Bearer tok2");
    });

    it("prefers the bearer token over basic auth, and falls back when it returns nothing", async () => {
        let value: string | null = "abc";
        const e621 = new E621({ authToken: () => value, authUser: "user", authKey: "key" });
        await e621.posts.get(1);
        value = null;
        await e621.posts.get(1);
        assert.equal(requests[0]?.headers.get("Authorization"), "Bearer abc");
        assert.equal(requests[1]?.headers.get("Authorization"), `Basic ${btoa("user:key")}`);
    });

    it("picks up a token set after construction", async () => {
        const e621 = new E621();
        e621.options.authToken = "late";
        await e621.posts.get(1);
        assert.equal(requests[0]?.headers.get("Authorization"), "Bearer late");
    });
});

describe("OAuthClient", () => {
    it("builds an authorization url with a valid PKCE challenge", async () => {
        const oauth = new OAuthClient({ clientId: "id", redirectURI: "https://example.com/cb", scopes: ["openid", "full"] });
        const { url, state, codeVerifier } = await oauth.createAuthorizationURL();
        const parsed = new URL(url);
        assert.equal(parsed.origin + parsed.pathname, "https://e621.net/oauth/authorize");
        assert.equal(parsed.searchParams.get("response_type"), "code");
        assert.equal(parsed.searchParams.get("client_id"), "id");
        assert.equal(parsed.searchParams.get("redirect_uri"), "https://example.com/cb");
        assert.equal(parsed.searchParams.get("scope"), "openid full");
        assert.equal(parsed.searchParams.get("state"), state);
        assert.equal(parsed.searchParams.get("code_challenge_method"), "S256");
        assert.equal(parsed.searchParams.get("code_challenge"), createHash("sha256").update(codeVerifier).digest("base64url"));
        assert.match(codeVerifier, /^[\w-]{43}$/);
    });

    it("handles a callback, exchanging the code without user auth", async () => {
        const saved: Array<Generated.OAuthToken | null> = [];
        const oauth = new OAuthClient({ clientId: "id", clientSecret: "secret", redirectURI: "https://example.com/cb", onToken: t => void saved.push(t) });
        responses = [json(token())];
        const result = await oauth.handleCallback("https://example.com/cb?code=thecode&state=s1", { state: "s1", codeVerifier: "verifier" });
        assert.equal(result.access_token, "access");
        assert.equal(oauth.token?.access_token, "access");
        assert.deepEqual(saved.map(t => t?.access_token), ["access"]);

        const req = requests[0]!;
        assert.equal(req.url, "https://e621.net/oauth/token");
        assert.equal(req.headers.get("Authorization"), null);
        const body = new URLSearchParams(await req.text());
        assert.equal(body.get("grant_type"), "authorization_code");
        assert.equal(body.get("code"), "thecode");
        assert.equal(body.get("code_verifier"), "verifier");
        assert.equal(body.get("redirect_uri"), "https://example.com/cb");
        assert.equal(body.get("client_id"), "id");
        assert.equal(body.get("client_secret"), "secret");
    });

    it("rejects a callback with the wrong state or an error", async () => {
        const oauth = new OAuthClient({ clientId: "id" });
        await assert.rejects(oauth.handleCallback("?code=x&state=bad", { state: "good", codeVerifier: "v" }), (err: OAuthCallbackError) => err instanceof OAuthCallbackError && err.error === "invalid_state");
        await assert.rejects(oauth.handleCallback("?error=access_denied&error_description=nope&state=good", { state: "good", codeVerifier: "v" }), (err: OAuthCallbackError) => err.error === "access_denied" && err.errorDescription === "nope");
        assert.equal(requests.length, 0);
    });

    it("refreshes an expired token once for concurrent callers", async () => {
        const oauth = new OAuthClient({ clientId: "id", token: token({ created_at: 0, expires_in: 1 }) });
        assert.equal(oauth.isExpired, true);
        responses = [json(token({ access_token: "new", refresh_token: "refresh2" }))];
        const [a, b] = await Promise.all([oauth.getAccessToken(), oauth.getAccessToken()]);
        assert.equal(a, "new");
        assert.equal(b, "new");
        assert.equal(requests.length, 1);
        const body = new URLSearchParams(await requests[0]!.text());
        assert.equal(body.get("grant_type"), "refresh_token");
        assert.equal(body.get("refresh_token"), "refresh");
        assert.equal(oauth.isExpired, false);
    });

    it("works as an E621 authToken provider", async () => {
        const oauth = new OAuthClient({ clientId: "id", token: token() });
        const e621 = new E621({ authToken: oauth.getAccessToken });
        await e621.posts.get(1);
        assert.equal(requests[0]?.headers.get("Authorization"), "Bearer access");
    });

    it("sends the access token as a bearer token for token info", async () => {
        const oauth = new OAuthClient({ clientId: "id", token: token() });
        responses = [json({ resource_owner_id: 1, scope: ["full"], expires_in: 100, application: { uid: "id" }, created_at: 0 })];
        const info = await oauth.tokenInfo();
        assert.equal(info.resource_owner_id, 1);
        assert.equal(requests[0]?.url, "https://e621.net/oauth/token/info");
        assert.equal(requests[0]?.headers.get("Authorization"), "Bearer access");
    });

    it("revokes and clears the token", async () => {
        const saved: Array<Generated.OAuthToken | null> = [];
        const oauth = new OAuthClient({ clientId: "id", token: token(), onToken: t => void saved.push(t) });
        responses = [json({})];
        await oauth.revoke();
        assert.equal(oauth.token, null);
        assert.deepEqual(saved, [null]);
        const body = new URLSearchParams(await requests[0]!.text());
        assert.equal(body.get("token"), "access");
        await assert.rejects(oauth.getAccessToken());
    });

    it("includes the OAuth error description in failed token requests", async () => {
        const oauth = new OAuthClient({ clientId: "id" });
        responses = [json({ error: "invalid_grant", error_description: "The code is invalid." }, 400)];
        await assert.rejects(oauth.exchangeCode("x", "v"), /invalid_grant: The code is invalid\./);
    });
});
