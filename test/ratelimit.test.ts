import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import E621 from "../dist/lib/index.js";
import { RatelimitError, parseRetryAfter } from "../dist/lib/errors.js";

import type { RatelimitInfo } from "../dist/lib/index.js";

let responses: Array<Response>;
let callCount: number;
const originalFetch = globalThis.fetch;

before(() => {
    globalThis.fetch = ((input: Request) => {
        callCount++;
        const res = responses.shift();
        assert.ok(res, `unexpected extra fetch call (#${callCount}) for ${input.url}`);
        return Promise.resolve(res);
    }) as typeof fetch;
});

after(() => {
    globalThis.fetch = originalFetch;
});

beforeEach(() => {
    callCount = 0;
    responses = [];
});

function ratelimited(retryAfter?: string): Response {
    return new Response(JSON.stringify({ error: "Ratelimited" }), {
        status: 429,
        statusText: "Too Many Requests",
        headers: retryAfter === undefined ? {} : { "Retry-After": retryAfter },
    });
}

function ok(): Response {
    return new Response(JSON.stringify({ id: 1, tags: ["tag1"] }), {
        status: 200,
        headers: { "content-type": "application/json" },
    });
}

describe("ratelimit handling", () => {
    it("retries a 429 response and returns the eventual success", async () => {
        const e621 = new E621({ ratelimit: { retryDelay: 0 } });
        responses = [ratelimited("0"), ratelimited("0"), ok()];
        const post = await e621.posts.get(1);
        assert.equal(callCount, 3);
        assert.ok(post);
        assert.equal(post.id, 1);
    });

    it("calls onRatelimit for every 429, with the right attempt/willRetry info", async () => {
        const e621 = new E621({ ratelimit: { retryDelay: 0 } });
        responses = [ratelimited("0"), ratelimited("0"), ok()];
        const seen: Array<RatelimitInfo> = [];
        (e621.options.ratelimit).onRatelimit = (info) => seen.push(info);
        await e621.posts.get(1);
        assert.equal(seen.length, 2);
        assert.equal(seen[0]?.attempt, 1);
        assert.equal(seen[0]?.willRetry, true);
        assert.equal(seen[0]?.retryAfter, 0);
        assert.equal(seen[1]?.attempt, 2);
        assert.equal(seen[1]?.willRetry, true);
    });

    it("throws RatelimitError once retries are exhausted", async () => {
        const e621 = new E621({ ratelimit: { retryDelay: 0, maxRetries: 2 } });
        responses = [ratelimited("0"), ratelimited("0"), ratelimited("0")];
        await assert.rejects(() => e621.posts.get(1), (error: unknown) => {
            assert.ok(error instanceof RatelimitError);
            assert.equal(error.retryAfter, 0);
            assert.match(error.message, /Ratelimited/);
            return true;
        });
        assert.equal(callCount, 3);
    });

    it("doesn't retry when ratelimit.retry is disabled", async () => {
        const e621 = new E621({ ratelimit: { retry: false } });
        responses = [ratelimited("5")];
        await assert.rejects(() => e621.posts.get(1), RatelimitError);
        assert.equal(callCount, 1);
    });

    it("falls back to retryDelay (with exponential backoff) when Retry-After is missing", async () => {
        const e621 = new E621({ ratelimit: { retryDelay: 0 } });
        responses = [ratelimited(), ok()];
        const seen: Array<RatelimitInfo> = [];
        (e621.options.ratelimit).onRatelimit = (info) => seen.push(info);
        await e621.posts.get(1);
        assert.equal(seen[0]?.retryAfter, null);
    });
});

describe("parseRetryAfter", () => {
    it("returns null with no response", () => {
        assert.equal(parseRetryAfter(undefined), null);
    });

    it("returns null when the header is missing", () => {
        assert.equal(parseRetryAfter(new Response(null, { headers: {} })), null);
    });

    it("parses a delay-seconds value", () => {
        assert.equal(parseRetryAfter(new Response(null, { headers: { "Retry-After": "12" } })), 12);
    });

    it("parses an HTTP-date value", () => {
        const future = new Date(Date.now() + 30_000).toUTCString();
        const seconds = parseRetryAfter(new Response(null, { headers: { "Retry-After": future } }));
        assert.ok(seconds !== null && seconds > 20 && seconds <= 30, `expected ~30, got ${seconds}`);
    });

    it("returns null for an unparsable value", () => {
        assert.equal(parseRetryAfter(new Response(null, { headers: { "Retry-After": "not-a-date" } })), null);
    });
});
