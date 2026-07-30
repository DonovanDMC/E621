import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { after, before, describe, it } from "node:test";

import { chromium, type Browser } from "playwright";

/** Assumes `npm run build` has already produced `dist/` (including the browser bundle). */
const distDir = new URL("../dist/", import.meta.url);

const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".map": "application/json",
};

function startServer(): Promise<{ baseUrl: string; server: Server }> {
    const server = createServer((req, res) => {
        void (async (): Promise<void> => {
            const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
            if (pathname === "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("<!doctype html><title>e621 browser bundle test</title>");
                return;
            }
            try {
                const filePath = new URL(`.${pathname}`, distDir);
                const data = await readFile(filePath);
                const ext = pathname.slice(pathname.lastIndexOf("."));
                res.writeHead(200, { "Content-Type": contentTypes[ext] ?? "application/octet-stream" });
                res.end(data);
            } catch {
                res.writeHead(404);
                res.end();
            }
        })();
    });

    return new Promise((resolve, reject) => {
        server.on("error", reject);
        server.listen(0, "127.0.0.1", () => {
            const address = server.address();
            if (address === null || typeof address === "string") {
                reject(new Error("failed to bind test server"));
                return;
            }
            resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
        });
    });
}

describe("browser bundle", () => {
    let baseUrl: string;
    let browser: Browser;
    let server: Server;

    before(async () => {
        ({ server, baseUrl } = await startServer());
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
        await new Promise<void>(resolve => server.close(() => { resolve(); }));
    });

    it("loads in a real browser with no Node built-ins, and exposes the expected module surface", async () => {
        const page = await browser.newPage();
        const pageErrors: Array<string> = [];
        page.on("pageerror", err => pageErrors.push(err.message));

        await page.goto(baseUrl);
        const result = await page.evaluate(async () => {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- the import path only resolves in the browser (over HTTP from our test server), not to tsc/eslint, so it's untyped `any` */
            // @ts-expect-error resolved by the browser over HTTP from our test server, not by tsc - see startServer() above
            const mod = await import("/browser/e621.js");
            const E621 = mod.default;
            const e621 = new E621() as unknown as Record<string, unknown>;
            /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
            return {
                hasPosts: typeof e621.posts === "object",
                hasFavorites: typeof e621.favorites === "object",
                hasStaffWikis: typeof e621.staffWikis === "object",
                hasNestedStaff: e621.staff !== undefined,
                userAgentInQuery: (e621.options as { userAgentInQuery: boolean }).userAgentInQuery,
            };
        });

        assert.deepEqual(pageErrors, []);
        assert.deepEqual(result, {
            hasPosts: true,
            hasFavorites: true,
            hasStaffWikis: true,
            hasNestedStaff: false,
            userAgentInQuery: true,
        });
    });
});
