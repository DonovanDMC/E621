import assert from "node:assert/strict";
import { describe, it } from "node:test";

import Favorites from "../dist/lib/modules/Favorites.js";
import Posts from "../dist/lib/modules/Posts.js";
import { createE621Client, createStandalone } from "../dist/lib/standalone.js";

describe("createE621Client", () => {
    it("resolves defaults when given no options", () => {
        const { options } = createE621Client();
        assert.equal(options.baseURL, "https://e621.net");
        assert.equal(options.authKey, null);
        assert.equal(options.authUser, null);
        assert.equal(options.requestTimeout, 30);
        assert.match(options.userAgent, /^E621\/\d+\.\d+\.\d+ \(https:\/\/github\.com\/DonovanDMC\/E621\)$/);
    });

    it("includes the auth user in the default user agent when auth is provided", () => {
        const { options } = createE621Client({ authUser: "someone", authKey: "key" });
        assert.match(options.userAgent, /"someone"/);
    });

    it("respects an explicit user agent override", () => {
        const { options } = createE621Client({ userAgent: "custom-agent/1.0" });
        assert.equal(options.userAgent, "custom-agent/1.0");
    });
});

describe("createStandalone", () => {
    it("derives property keys from each module's moduleKey", () => {
        const { client } = createE621Client();
        const e621 = createStandalone([Posts, Favorites], client);
        assert.deepEqual(Object.keys(e621).sort(), ["favorites", "posts"]);
        assert.ok(e621.posts instanceof Posts);
        assert.ok(e621.favorites instanceof Favorites);
    });

    it("wires every included module to reference the same standalone e621 object", () => {
        const { client } = createE621Client();
        const e621 = createStandalone([Posts, Favorites], client);
        // `e621`/`client` are non-enumerable (hidden from JSON/inspect) but still real, directly
        // accessible runtime properties - TS's `protected` is a compile-time-only construct.
        const posts = e621.posts as unknown as { e621: unknown };
        const favorites = e621.favorites as unknown as { e621: unknown };
        assert.equal(posts.e621, e621);
        assert.equal(favorites.e621, e621);
    });
});
