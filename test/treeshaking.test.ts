import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { bundle, distLib, hasModule } from "./helpers/bundle.js";

const standaloneEntry = `
import Posts from ${JSON.stringify(new URL("modules/Posts.js", distLib).pathname)};
import Favorites from ${JSON.stringify(new URL("modules/Favorites.js", distLib).pathname)};
import { createE621Client, createStandalone } from ${JSON.stringify(new URL("standalone.js", distLib).pathname)};

const { client } = createE621Client();
export const e621 = createStandalone([Posts, Favorites], client);
`;

const fullEntry = `
import E621 from ${JSON.stringify(new URL("index.js", distLib).pathname)};
export const e621 = new E621();
`;

describe("tree-shaking", () => {
    let standaloneBundle: string;
    let fullBundle: string;

    before(async () => {
        [standaloneBundle, fullBundle] = await Promise.all([bundle(standaloneEntry), bundle(fullEntry)]);
    });

    for (const moduleKey of ["bans", "tickets", "appeals", "mascots", "ipBans", "forumTopics", "uploads", "tags"]) {
        it(`excludes unrelated module "${moduleKey}" from a standalone Posts + Favorites bundle`, () => {
            assert.equal(hasModule(standaloneBundle, moduleKey), false);
        });
    }

    it("still contains the modules that were actually requested", () => {
        assert.equal(hasModule(standaloneBundle, "posts"), true);
        assert.equal(hasModule(standaloneBundle, "favorites"), true);
    });

    it("is meaningfully smaller than bundling the full E621 client", () => {
        assert.ok(
            standaloneBundle.length < fullBundle.length * 0.85,
            `standalone bundle (${standaloneBundle.length} bytes) should be under 85% of the full client (${fullBundle.length} bytes)`,
        );
    });

    it("sanity check: the full client really does include everything (so the comparison above is meaningful)", () => {
        assert.equal(hasModule(fullBundle, "bans"), true);
        assert.match(fullBundle, /function apply\(/);
    });
});
