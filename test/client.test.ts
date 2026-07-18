import assert from "node:assert/strict";
import { describe, it } from "node:test";

import E621 from "../dist/lib/index.js";

describe("E621 client", () => {
    it("resolves default options", () => {
        const e621 = new E621();
        assert.equal(e621.options.baseURL, "https://e621.net");
        assert.equal(e621.options.authKey, null);
        assert.equal(e621.options.authUser, null);
    });

    it("exposes every module flat off the instance", () => {
        const e621 = new E621() as unknown as Record<string, unknown>;
        for (const key of ["posts", "users", "favorites", "pools", "comments", "wikiPages"]) {
            assert.equal(typeof e621[key], "object", `expected e621.${key} to be an object`);
        }
    });

    it("exposes former staff.* modules flat instead of nested under staff", () => {
        const e621 = new E621() as unknown as Record<string, unknown>;
        for (const key of ["staffAutomodDMails", "staffDmails", "staffExceptionLogs", "staffFiles", "staffUserCleanups", "staffUsers", "staffVoteTrends", "staffWikis", "staffWikiVersions"]) {
            assert.equal(typeof e621[key], "object", `expected e621.${key} to be an object`);
        }
        assert.equal(e621.staff, undefined);
    });
});
