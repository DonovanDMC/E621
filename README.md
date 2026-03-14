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
