import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import E621 from "../dist/lib/index.js";
import BasicPost from "../dist/lib/models/BasicPost.js";
import ExtendedPost from "../dist/lib/models/ExtendedPost.js";
import Post from "../dist/lib/models/Post.js";

const extendedTags = {
    general: ["tag1"], artist: [], contributor: [], copyright: [], character: [], species: [], invalid: [], meta: [], lore: [],
};

let capturedURL: URL;
let responseBody: unknown;
const originalFetch = globalThis.fetch;

before(() => {
    globalThis.fetch = ((input: Request) => {
        capturedURL = new URL(input.url);
        return Promise.resolve(new Response(JSON.stringify(responseBody), { status: 200, headers: { "content-type": "application/json" } }));
    }) as typeof fetch;
});

after(() => {
    globalThis.fetch = originalFetch;
});

describe("defaultPostFormat", () => {
    it("falls back to the legacy format when no default is configured", async () => {
        const e621 = new E621();
        responseBody = { post: { id: 1, tags: "tag1" } };
        const post = await e621.posts.get(1);
        assert.equal(capturedURL.searchParams.get("v2"), null);
        assert.ok(post instanceof Post);
    });

    it("applies the configured default v2/mode to the actual request and the returned model", async () => {
        const e621 = new E621({ defaultPostFormat: { v2: true, mode: "extended" } });
        responseBody = { id: 1, tags: extendedTags };
        const post = await e621.posts.get(1);
        assert.equal(capturedURL.searchParams.get("v2"), "true");
        assert.equal(capturedURL.searchParams.get("mode"), "extended");
        assert.ok(post instanceof ExtendedPost);
    });

    it("lets an explicit per-call option override the configured default", async () => {
        const e621 = new E621({ defaultPostFormat: { v2: true, mode: "extended" } });
        responseBody = { post: { id: 1, tags: "tag1" } };
        const post = await e621.posts.get(1, { v2: false });
        assert.equal(capturedURL.searchParams.get("v2"), "false");
        assert.ok(post instanceof Post);
    });

    it("applies the configured default to model convenience methods (e.g. post.update())", async () => {
        const e621 = new E621({ defaultPostFormat: { v2: true, mode: "basic" } });
        responseBody = { id: 1, tags: ["tag1"] };
        const post = new BasicPost(e621, { id: 1, tags: ["tag1"] } as never);
        const updated = await post.update();
        assert.equal(capturedURL.searchParams.get("v2"), "true");
        assert.equal(capturedURL.searchParams.get("mode"), "basic");
        assert.ok(updated instanceof BasicPost);
    });

    it("respects a default on favorites.search()/popular.get() too", async () => {
        const e621 = new E621({ defaultPostFormat: { v2: true, mode: "extended" } });
        responseBody = [{ id: 1, tags: extendedTags }];
        const [post] = await e621.favorites.search();
        assert.equal(capturedURL.searchParams.get("v2"), "true");
        assert.equal(capturedURL.searchParams.get("mode"), "extended");
        assert.ok(post instanceof ExtendedPost);
    });
});
