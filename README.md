# E621

The most comprehensive wrapper for e621 you'll ever find.

We support almost anything normal users can do, with plans to bring everything else in, and more later in development.

See the [Features List](Features/README.md) for all of the things this module supports, and what is planned.

<hr>

This module is structured with submodules corresponding to separate areas of the site. All of these modules are on the primary class, which can be constructed like so:
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
| `userAgent` | String | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L57-L59) | UserAgent for requests |

#### Instance Options
These are set via the `setInstance` function.
| Option | Type | Default | Description |
|:---:|:---:|:---:|:---:|
| `reconstructStaticURL` | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/util/RequestHandler.ts#L254-L256) | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L19-L23) | Override default url reconstruction |
| `imageReconstructionType` | "e621" \| "yiffy" \| "local" \| null | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L35) | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L37) |
| `ssl` | Boolean | [^1] | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L5) |
| `port` | Number | [^1] | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L11) |
| `host` | String | [^1] | [See Code](https://github.com/DonovanDMC/E621/blob/4bc4e2db7cc8389635d710a852ab6a88a0570602/src/types/index.d.ts#L15) |

[^1]: This is very dependent on where this function is used. If used on a subclass, like `Yiffy` or `Dev` the defaults will be set to something else, but otherwise they are: true, 443, e621.net

### Using YiffyAPI or E621 Dev?
We've got built in classes for both. E621 dev assumes you're using [e621ng@ce871e4](https://github.com/zwagoth/e621ng/commit/ce871e412c4d2e1e2478a0e5049d20c77cd3f4d7) or later, as they changed where the dev site is accessed in this commit.
you can use the built in sub-classes `E621.YiffyAPI` `E621.Dev` to access these, and for anything else: there's `E621.Custom`
```ts
import E621 from "e621"; // or import { YiffyAPI, Dev, Custom } from "e621";

// first and only parameter is Options
const yapi = new E621.Yiffy();
const dev = new E621.Dev();
// first parameter is Options, second is InstanceOptions
const custom = new E621.Custom({}, {
	host: "example.com",
	port: 443,
	ssl: true
});
```
