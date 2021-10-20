# E621

The most comprehensive wrapper for e621 you'll ever find.

We support almost anything normal users can do, with plans to bring everything else in, and more later in development.

### Features:
- [x] Creating Posts (Buffer & URL)
- [x] Listing/Creating/Editing/Voting On/Favoriting Posts
- [x] Listing/Creating/Editing/Deleting/Modifying/Adding To/Removing From Post Sets
- [x] Listing/Creating/Editing/Deleting/Modifying/Adding To/Removing From Pools
- [x] Listing/Creating/Deleting/Editing User Feedback
- [x] Reverting Pool Changes
- [x] Listing Post History
- [x] Editing The Authenticated User (all properties minus password and email)
- [ ] Deleting/Approving/Unapproving/Destroying Posts
- [ ] Creating/Solving/Deleting Post Flags
- [ ] Listing/Creating/Editing/Deleting/Modifying Wiki Pages
- [ ] Listing/Creating/Editing/Deleting/Modifying Artists
- [ ] Listing/Editing/Deleting/Modifying Tags
- [ ] General Janitorial/Moderative/Admninistrative Actions
- [ ] More Planned!

### Not Planned:
- Dmails (routes do not support json, and I'm not scraping html)

<hr>

This module is structures with submodules corresponding to separate areas of the site.

A map of things you may want to do, to their methods is listed below.

## Methods
The legend for the symbols can be found after the table.
| Section       | Description              | Location               |
|---------------|--------------------------|------------------------|
| Pools         | Get Pool                 | `pools.get`            |
| Pools         | Get Pool By Name         | `pools.getByName`      |
| Pools         | Search Pools             | `pools.search`         |
| Pools         | Create Pool*             | `pools.create`         |
| Pools         | Modify Pool*             | `pools.modify`         |
| Pools         | Delete Pool^             | `pools.delete`         |
| Pools         | Revert Pool*             | `pools.revert`         |
| Pools         | Search Pool History      | `pools.searchHistory`  |
| Pools         | Add Post To Pool         | `pools.addPost`        |
| Pools         | Remove Post From Pool    | `pools.removePost`     |
| Type          | Description              | Location               |
| Posts         | Get Post By ID           | `posts.get`            |
| Posts         | Get Post By MD5          | `posts.getByMD5`       |
| Posts         | Search Posts             | `posts.search`         |
| Posts         | Create Post*             | `posts.create`         |
| Posts         | Modify Post*             | `posts.modify`         |
| Posts         | Vote On Post*            | `posts.vote`           |
| Type          | Description              | Location               |
| Post Sets     | Get Post Set             | `postSets.get`         |
| Post Sets     | Search Sets              | `postSets.search`      |
| Post Sets     | Create Post Set*         | `postSets.create`      |
| Post Sets     | Modify Post Set*         | `postSets.modify`      |
| Post Sets     | Delete Post Set*         | `postSets.delete`      |
| Post Sets     | Add Post To Set*         | `postSets.addPost`     |
| Post Sets     | Remove Post From Set*    | `postSets.removePost`  |
| Type          | Description              | Location               |
| User Feedback | Get Feedback             | `userFeedback.get`     |
| User Feedback | Search Feedback          | `userFeedback.search`  |
| User Feedback | Create Feedback#         | `userFeedback.create`  |
| User Feedback | Modify Feedback#         | `userFeedback.modify`  |
| User Feedback | Delete Feedback#         | `userFeedback.delete`  |
| Type          | Description              | Location               |
| Users         | Get User (ID/Name)       | `users.get`            |
| Users         | Search Users             | `users.search`         |
| Users         | Get Authenticated User*  | `users.getSelf`        |
| Users         | Edit Authenticated User* | `users.editSelf`       |
| Users         | Get Upload Limit*        | `users.getUploadLimit` |
| Users         | Get Favorites            | `users.getFavorites`   |
| Users         | Add Favorite*            | `users.addFavorite`    |
| Users         | Remove Favorite*         | `users.removeFavorite` |

#### Method Symbol Legend
| Symbol | Meaning                 |
|--------|-------------------------|
| *      | Requires Authentication |
| $      | Requires Privileged     |
| ^      | Requires Janitor        |
| #      | Requires Moderator      |
| &      | Requires Admin          |
