# E621

The most comprehensive wrapper for e621 you'll ever find.

We support almost anything normal users can do, with plans to bring everything else in, and more later in development.

### Features:
- [x] Creating Posts (Buffer & URL)
- [x] Listing/Creating/Editing/Voting On/Favoriting Posts
- [x] Listing/Creating/Editing/Deleting/Adding To/Removing From Post Sets
- [x] Listing/Creating/Editing/Deleting/Adding To/Removing From Pools
- [x] Listing/Creating/Editing/Deleting Wiki Pages
- [x] Listing/Creating/Editing/Deleting Artists
- [x] Listing/Creating/Deleting/Editing User Feedback
- [x] Reverting Pool Changes
- [x] Listing Post History
- [x] Editing The Authenticated User (all properties minus password and email)
- [ ] Deleting/Approving/Unapproving/Destroying Posts
- [ ] Creating/Solving/Deleting Post Flags
- [ ] Listing/Editing/Deleting Tags
- [ ] General Janitorial/Moderative/Admninistrative Actions
- [ ] More Planned!

### Not Planned:
- Dmails (routes do not support json, and I'm not scraping html)

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

A map of features we support to their methods is listed below.

## Methods
The legend for the symbols can be found after the table.
| Section | Description | Location |
|:---:|:---:|:---:|
| Artists | Get Artist | `artists.get` |
| Artists | Get Artist By Name | `artists.getByName` |
| Artists | Search Artists | `artists.search` |
| Artists | Create Artist* | `artists.create` |
| Artists | Modify Artist* | `artists.modify` |
| Artists | Delete Artist^ | `artists.delete` |
| Artists | Revert Artist* | `artists.revert` |
| Artists | Search Artist History | `artists.searchHistory` |
| Type | Description | Location || Pools | Get Pool | `pools.get` |
| Pools | Get Pool By Name | `pools.getByName` |
| Pools | Search Pools | `pools.search` |
| Pools | Create Pool* | `pools.create` |
| Pools | Modify Pool* | `pools.modify` |
| Pools | Delete Pool^ | `pools.delete` |
| Pools | Revert Pool* | `pools.revert` |
| Pools | Search Pool History | `pools.searchHistory` |
| Pools | Add Post To Pool | `pools.addPost` |
| Pools | Remove Post From Pool | `pools.removePost` |
| Type | Description | Location |
| Posts | Get Post By ID | `posts.get` |
| Posts | Get Post By MD5 | `posts.getByMD5` |
| Posts | Search Posts | `posts.search` |
| Posts | Create Post* | `posts.create` |
| Posts | Modify Post* | `posts.modify` |
| Posts | Vote On Post* | `posts.vote` |
| Posts | Revert Post* | `posts.revert` |
| Posts | Search Post History | `posts.searchHistory` |
| Type | Description | Location |
| Post Sets | Get Post Set | `postSets.get` |
| Post Sets | Search Sets | `postSets.search` |
| Post Sets | Create Post Set* | `postSets.create` |
| Post Sets | Modify Post Set* | `postSets.modify` |
| Post Sets | Delete Post Set* | `postSets.delete` |
| Post Sets | Add Post To Set* | `postSets.addPost` |
| Post Sets | Remove Post From Set* | `postSets.removePost` |
| Type | Description | Location |
| User Feedback | Get Feedback | `userFeedback.get` |
| User Feedback | Search Feedback | `userFeedback.search` |
| User Feedback | Create Feedback# | `userFeedback.create` |
| User Feedback | Modify Feedback# | `userFeedback.modify` |
| User Feedback | Delete Feedback# | `userFeedback.delete` |
| Type | Description | Location |
| Users | Get User (ID/Name) | `users.get` |
| Users | Search Users | `users.search` |
| Users | Get Authenticated User* | `users.getSelf` |
| Users | Edit Authenticated User* | `users.editSelf` |
| Users | Get Upload Limit* | `users.getUploadLimit` |
| Users | Get Favorites | `users.getFavorites` |
| Users | Add Favorite* | `users.addFavorite` |
| Users | Remove Favorite* | `users.removeFavorite` |
| Type | Description | Location |
| Wiki Page | Get Wiki Page | `wikiPages.get` |
| Wiki Page | Get Wiki Page (By Name) | `wikiPages.getByName` |
| Wiki Page | Search Wiki Pages | `wikiPages.search` |
| Wiki Page | Create Wiki Page* | `wikiPages.create` |
| Wiki Page | Modify Wiki Page* | `wikiPages.modify` |
| Wiki Page | Delete Wiki Page^ | `wikiPages.delete` |
| Wiki Page | Revert Wiki Page* | `wikiPages.revert` |
| Wiki Page | Search Wiki Page History | `wikiPages.searchHistory` |

#### Method Symbol Legend
| Symbol | Meaning                 |
|:------:|:-----------------------:|
| *      | Requires Authentication |
| $      | Requires Privileged     |
| ^      | Requires Janitor        |
| #      | Requires Moderator      |
| &      | Requires Admin          |
