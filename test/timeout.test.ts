import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { UnexpectedResponseError } from "../dist/lib/errors.js";
import E621 from "../dist/lib/index.js";

const originalFetch = globalThis.fetch;

before(() => {
    // never responds, only settles when the signal aborts
    globalThis.fetch = ((_input: Request, init?: RequestInit) => new Promise((_resolve, reject) => {
        // AbortSignal.timeout's timer is unref'd, a real fetch's socket would keep the process alive
        const keepAlive = setTimeout(() => {}, 10_000);
        init?.signal?.addEventListener("abort", () => {
            clearTimeout(keepAlive);
            reject(init.signal?.reason as Error);
        });
    })) as typeof fetch;
});

after(() => {
    globalThis.fetch = originalFetch;
});

describe("requestTimeout", () => {
    it("aborts requests that take longer than requestTimeout", async () => {
        const e621 = new E621({ requestTimeout: 0.05 });
        const start = Date.now();
        await assert.rejects(() => e621.posts.get(1), (error: unknown) => {
            assert.ok(error instanceof UnexpectedResponseError);
            assert.match(error.message, /aborted due to timeout/);
            return true;
        });
        assert.ok(Date.now() - start < 1000);
    });
});
