# E621

The most comprehensive wrapper for e621 you'll ever find.

We have as close to 100% coverage of the API as possible.

### This module is not officially supported or endorsed by any of the e621 staff. Do not go to them if something does not work.

Documentation on the available methods and their inputs can be found in the [docs](https://js.e621.wiki). The actual implementation of methods is generated from the [OpenAPI Spec](https://e621.wiki), so if a parameter is missing, a path is wrong, a route is missing, etc., then it should be reported to the spec's repository and not here.

## Installation

NodeJS **20.19.0** or higher is required.

```bash
npm install e621
```

**This package is ESM only. [Your project should be too.](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)**

## Usage

This module is structured with submodules corresponding to separate areas of the site. All of these modules are on the primary class, which can be constructed like so:
```typescript
import E621 from "e621"; // or const E621 = require("e621");

// no options are required, see https://js.e621.wiki/latest/interfaces/Options.html for the options
const e621 = new E621();

// the options are all an object in the first parameter, e.g.
const e621 = new E621({
	authUser: "",
	authKey:  ""
});

// all of the available modules stem from this main class,
// e.g. use e621.posts.METHOD(), e621.users.METHOD()
```

### Bearer Tokens & OAuth

Instead of `authUser`/`authKey`, you can authenticate with a bearer token (e.g. an OAuth access token). It can be a string, or a function that returns one, which is called for every request. If both are given, the bearer token wins.
```typescript
const e621 = new E621({ authToken: "..." });
```

`OAuthClient` handles the OAuth 2.0 authorization code flow (with PKCE) for you, and keeps the access token refreshed. **OAuth has not been publicly released on e621 yet.**
```typescript
import E621, { OAuthClient } from "e621"; // or from "e621/oauth"

const oauth = new OAuthClient({
	clientId:     "",
	clientSecret: "", // leave out for public clients
	redirectURI:  "https://example.com/callback",
	scopes:       ["openid", "full"],
	token:        savedToken, // optional, restore a previous token
	onToken:      (token) => saveToken(token), // called when the token is exchanged, refreshed, or revoked
});

// keep state & codeVerifier (e.g. in the session), and send the user to url
const { url, state, codeVerifier } = await oauth.createAuthorizationURL();

// once they're redirected back, this checks the state and exchanges the code
await oauth.handleCallback(callbackURL, { state, codeVerifier });

// getAccessToken refreshes the token when it's about to expire
const e621 = new E621({ authToken: oauth.getAccessToken });

await oauth.userInfo();
await oauth.revoke();
```

### Default Post Format

Post-returning methods (`posts.get()`, `posts.search()`, `favorites.search()`, `popular.get()`, `iqdbQueries.get()`/`.post()`, and convenience methods on returned post models like `post.update()`) accept per-call `v1`/`mode` options and default to the basic format when omitted (`v1: true` returns the deprecated legacy format). Set `defaultPostFormat` once to change that default everywhere instead of repeating the same options on every call:
```typescript
const e621 = new E621({
	defaultPostFormat: { mode: "extended" }
});

const post = await e621.posts.get(123); // ExtendedPost, typed accurately - no cast needed
await post?.update({ tags: "foo" }); // also resolves to ExtendedPost

// a per-call option still overrides the default for that one call
const legacy = await e621.posts.get(123, { v1: true });
```

### Ratelimit Handling

Every request that comes back `429 Too Many Requests` is retried automatically, waiting for the duration in the response's `Retry-After` header (or an exponential backoff starting at `ratelimit.retryDelay` seconds if that header is missing). If it's still ratelimited after `ratelimit.maxRetries` attempts, or `ratelimit.retry` is turned off, a `RatelimitError` (see `retryAfter`) is thrown instead:
```typescript
import { RatelimitError } from "e621";

const e621 = new E621({
	ratelimit: {
		maxRetries: 5,     // default: 3
		retryDelay: 2,     // default: 1 (seconds, doubled per attempt as a fallback)
		maxRetryDelay: 30, // default: 60 (seconds, caps both the header and the fallback)
		onRatelimit: (info) => console.warn(`ratelimited, retrying in ${info.retryAfter}s`),
	}
});

try {
	await e621.posts.get(123);
} catch (err) {
	if (err instanceof RatelimitError) console.error(`still ratelimited, retry after ${err.retryAfter}s`);
}
```
Set `ratelimit: { retry: false }` to disable automatic retries and just throw `RatelimitError` on the first `429`.

## Browser Usage

A pre-bundled, browser-only build (no Node built-ins) is published at `e621/browser`, for use with a plain `<script type="module">` or a CDN like jsDelivr/unpkg:
```html
<script type="module">
	import E621 from "https://cdn.jsdelivr.net/npm/e621/dist/browser/e621.js";
	const e621 = new E621();
</script>
```

If you're importing `e621` through your own bundler (webpack/esbuild/rollup) instead, no special import is needed — resolving `node:util` and the optional `debug`/`persistent-debug` dependencies to no-op browser stubs is handled automatically via `package.json`'s `browser` field.

`import ... from "e621/browser"` is fully typed too — `e621/browser`'s `types` condition points at declarations re-exporting the same surface as the main entrypoint.

## Tree-Shakable / Standalone Modules

`new E621()` wires up every module (`posts`, `users`, `pools`, etc.) at construction time, so bundling it pulls in the whole library even if you only use a couple of methods. This is unavoidable for `new E621()` itself — bundlers tree-shake based on the static import graph, not on which properties you happen to access at runtime, so there's no way for a bundler to know only `.posts` will ever be touched (the same reason e.g. lodash requires `import debounce from "lodash/debounce"` instead of `import _ from "lodash"` for tree-shaking).

If bundle size matters more than convenience (e.g. embedding into a userscript), import only the specific modules you need from `e621/modules/*` and wire them up yourself with `e621/standalone`:
```typescript
import Posts from "e621/modules/Posts";
import Favorites from "e621/modules/Favorites";
import { createE621Client, createStandalone } from "e621/standalone";

// same Options as `new E621()`, handles auth headers/user agent/etc. for you
const client  = createE621Client({ authUser: "", authKey: "" });

// only the modules listed here (and their own dependencies) end up in your bundle;
// property names are each module's own `moduleKey` (matching `new E621()`'s naming, e.g. `posts`, `favorites`)
const e621 = createStandalone([Posts, Favorites], client);

const post = await e621.posts.random();
await post.favorite(); // works — `favorites` was included, so the cross-module call resolves
```
Convenience methods on returned models that call back into *other* modules (e.g. `post.favorite()`, which needs `favorites`) only work if you included that module in `createStandalone`'s array — otherwise they throw. Methods on the modules you did include work exactly as normal.

## Raw Types & SDK

The types, schemas, and request functions this library is built on come from [e621-openapi](https://www.npmjs.com/package/e621-openapi), which is generated directly from the [OpenAPI Spec](https://e621.wiki). If you only need the spec's types or the raw request functions, without models, convenience methods, or ratelimit handling, you can use that package on its own:
```typescript
import { posts_index } from "e621-openapi";
import { client } from "e621-openapi/client";

client.setConfig({
	headers: {
		"User-Agent": "MyProject/1.0 (by username on e621)"
	}
});

const { data } = await posts_index({ query: { tags: "fox", limit: 10 } });
```
Types alone can be imported from `e621-openapi/types` (e.g. `import type { BasicPost } from "e621-openapi/types"`). The same exports are also available through this library as `Generated` (or `e621/generated`), if you already depend on it.

## Testing

Tests live under `test/` and run on [Node's built-in test runner](https://nodejs.org/api/test.html) (no extra framework). Playwright's browser needs a one-time install; everything else, including the build tests import from, is handled by `npm test` itself:
```bash
npx playwright install --with-deps chromium   # one-time
npm test
```
- `test/treeshaking.test.ts` - bundles a standalone client with esbuild and asserts unrelated modules are excluded and the result is meaningfully smaller than `new E621()`.
- `test/standalone.test.ts` / `test/client.test.ts` - verify `createE621Client`/`createStandalone` wiring and the full `E621` client's module surface (no network calls).
- `test/browser.test.ts` - loads the browser bundle in a real headless Chromium (via [Playwright](https://playwright.dev)) and checks it works with no Node built-ins.
- `test/openapi.test.ts` - scans `lib/` for every `@OperationID(...)`/`@Schema(...)` and asserts the value actually exists in the OpenAPI spec (these aren't validated at runtime anymore - see the note in `lib/util.ts` - so this plus the build-time check in `scripts/replace-openapi.ts` are what catch a typo'd one).
- `test/defaultPostFormat.test.ts` - mocks `fetch` to verify `defaultPostFormat` actually reaches the outgoing request's query params, that the returned model matches, that a per-call option overrides it, and that it's picked up by model convenience methods too.

CI (`.github/workflows/test.yml`) runs the same on every push/PR, and gates releases (`publish.yml`) on it passing.

For interactive/manual browser testing (including a real network call against e621.net), see `scripts/browser-test.sh`.
