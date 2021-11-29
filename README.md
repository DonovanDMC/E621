# E621

The most comprehensive wrapper for e621 you'll ever find.

We support almost anything normal users can do, with plans to bring everything else in, and more later in development.

See the [Features List](Features/README.md) for all of the things this module supports, and what is planned.

<hr>

This module is structures with submodules corresponding to separate areas of the site. All of these modules are on the primary class, which can be constructed like so:
```typescript
import E621 from "e621"; // or const E621 = require("e621");

// no options are required, see below for the options
const e621 = new E621();

// the options are all an object in the first parameter, e.g.
const e621 = new E621({
	authUser: "",
	authKey:  ""
});

// all of the available modules stem from this main class,
// e.g. use e621.posts.METHOD(), e621.users.METHOD()
```

#### Options
Most of these options shouldn't be used unless you know what you're doing (you probably only need `authUser` and `authKey`, and you can set `userAgent`)
| Option | Type | Default | Description |
|:---:|:---:|:---:|:---:|
| `authUser` | String | None | User for authentication |
| `authKey` | String | None | Token for authentication |
| `userAgent` | String | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L57-L59) | UserAgent for requests |
| `reconstructStaticURL` | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/util/RequestHandler.ts#L254-L256) | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L63-L65) | Override default url reconstruction |
| `imageReconstructionType` | "e621" \| "yiffy" \| "local" \| null | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L39) | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L41) |
| `instanceSSL` | Boolean | true | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L03) |
| `instancePort` | Number | 443 | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L9) |
| `instanceHost` | String | e621.net | [See Code](https://github.com/DonovanDMC/E621/blob/89d662f19dc76c77e28f40b18a96f9043c4e2a3a/src/types/index.d.ts#L15) |
