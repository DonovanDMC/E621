import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import E621 from "../dist/lib/index.js";
import { PostVersion, SavedSearch, TagSubscription } from "../dist/lib/models/index.js";

type Handler = (request: Request) => Response;
let routes: Array<[method: string, path: string, handler: Handler]>;
let calls: Array<string>;
const originalFetch = globalThis.fetch;

before(() => {
    globalThis.fetch = ((input: Request) => {
        const { pathname } = new URL(input.url);
        calls.push(`${input.method} ${pathname}`);
        const route = routes.find(([method, path]) => method === input.method && path === pathname);
        assert.ok(route, `unexpected request: ${input.method} ${pathname}`);
        return Promise.resolve(route[2](input));
    }) as typeof fetch;
});

after(() => {
    globalThis.fetch = originalFetch;
});

beforeEach(() => {
    routes = [];
    calls = [];
});

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function upload(status: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
    return { id: 5, status, post_id: null, error_message: null, duplicate_post_id: null, ...extra };
}

const post = { post: { id: 10, tags: "tag1" } };

describe("response status codes", () => {
    it("post versions search reads the 200 array", async () => {
        const e621 = new E621();
        routes.push(["GET", "/post_versions.json", () => json([{ id: 1, post_id: 2 }])]);
        const versions = await e621.postVersions.search();
        assert.equal(versions.length, 1);
        assert.ok(versions[0] instanceof PostVersion);
    });

    it("redirecting endpoints return the location", async () => {
        const e621 = new E621();
        routes.push(["POST", "/tag_alias_requests.json", () => new Response(null, { status: 302, headers: { Location: "https://e621.net/forum_topics/1" } })]);
        assert.equal(await e621.tagAliases.create({ antecedent_name: "a", consequent_name: "b", reason: "c" } as never), "https://e621.net/forum_topics/1");
    });
});

describe("uploads", () => {
    it("returns the post right away when the upload finished inline", async () => {
        const e621 = new E621();
        routes.push(
            ["POST", "/uploads.json", () => json({ success: true, location: "/posts/10", post_id: 10, upload_id: 5 })],
            ["GET", "/posts/10.json", () => json(post)],
        );
        const result = await e621.uploads.create({ direct_url: "https://example.com/a.png", tag_string: "a", rating: "s" } as never);
        assert.equal(result.id, 10);
        assert.deepEqual(calls, ["POST /uploads.json", "GET /posts/10.json"]);
    });

    it("waits for asynchronous processing before getting the post", async () => {
        const e621 = new E621();
        const statuses = [upload("queued"), upload("processing"), upload("completed", { post_id: 10 })];
        routes.push(
            ["POST", "/uploads.json", () => json({ success: true, location: "/uploads/5", upload_id: 5 })],
            ["GET", "/uploads/5.json", () => json(statuses.shift())],
            ["GET", "/posts/10.json", () => json(post)],
        );
        const result = await e621.uploads.create({ direct_url: "https://example.com/a.png", tag_string: "a", rating: "s" } as never, { interval: 0 });
        assert.equal(result.id, 10);
        assert.equal(calls.filter(call => call === "GET /uploads/5.json").length, 3);
    });

    it("throws when processing fails", async () => {
        const e621 = new E621();
        routes.push(["GET", "/uploads/5.json", () => json(upload("failed", { error_message: "bad file" }))]);
        await assert.rejects(() => e621.uploads.wait(5, { interval: 0 }), /failed: bad file/);
    });

    it("throws when the upload is a duplicate", async () => {
        const e621 = new E621();
        routes.push(["GET", "/uploads/5.json", () => json(upload("duplicate: 3", { duplicate_post_id: 3 }))]);
        await assert.rejects(() => e621.uploads.wait(5, { interval: 0 }), /duplicate of post #3/);
    });

    it("gives up after the timeout", async () => {
        const e621 = new E621();
        routes.push(["GET", "/uploads/5.json", () => json(upload("processing"))]);
        await assert.rejects(() => e621.uploads.wait(5, { interval: 0.01, timeout: 0.05 }), /did not finish processing in time/);
    });
});

describe("saved searches and tag subscriptions", () => {
    it("lists saved searches as models", async () => {
        const e621 = new E621();
        routes.push(["GET", "/saved_searches.json", () => json([{ id: 1, query: "fox", name: null, is_tracked: true, is_subscription: false }])]);
        const searches = await e621.savedSearches.list();
        assert.ok(searches[0] instanceof SavedSearch);
    });

    it("sends tags space separated and wraps added subscriptions", async () => {
        const e621 = new E621();
        let body = "";
        routes.push(["POST", "/tag_subscriptions.json", (request) => {
            void request.text().then((text) => {
                body = text;
            });
            return json({ added: [{ id: 1, tag_id: 2, tag_name: "fox", category: 5 }], skipped: [{ name: "nope", reason: "does not exist" }] });
        }]);
        const result = await e621.tagSubscriptions.create(["fox", "nope"]);
        assert.ok(result.added[0] instanceof TagSubscription);
        assert.equal(result.skipped[0]?.reason, "does not exist");
        assert.equal(new URLSearchParams(body).get("tag_names"), "fox nope");
    });
});
