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

### Default Post Format

Post-returning methods (`posts.get()`, `posts.search()`, `favorites.search()`, `popular.get()`, `iqdbQueries.get()`/`.post()`, and convenience methods on returned post models like `post.update()`) accept per-call `v2`/`mode` options and default to the legacy format when omitted. Set `defaultPostFormat` once to change that default everywhere instead of repeating the same options on every call:
```typescript
const e621 = new E621({
	defaultPostFormat: { v2: true, mode: "extended" }
});

const post = await e621.posts.get(123); // ExtendedPost, typed accurately - no cast needed
await post?.update({ tags: "foo" }); // also resolves to ExtendedPost

// a per-call option still overrides the default for that one call
const legacy = await e621.posts.get(123, { v2: false });
```

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
