## Table Of Contents
- [Index](README.md)
- [Future Plans](FuturePlans.md)
- [E621 Search Inconsistencies](E621SearchInconsistencies.md)
- [Artists](Artists.md)
- [Blips](Blips.md)
- [Notes](Notes.md)
- [Pools](Pools.md)
- [Post Flags](PostFlags.md)
- [Posts](Posts.md)
- [Post Sets](PostSets.md)
- [Tags](Tags.md)
- [Takedowns](Takedowns.md)
- [User Feedback](UserFeedback.md)
- **Users**
- [Wiki Pages](WikiPages.md)

<hr>

|           Feature           | Implemented |         Method         |
|:---------------------------:|:-----------:|:----------------------:|
|          Get By ID          |      ✔️      |       `users.get`      |
|         Get By Name         |      ✔️      |    `users.getByName`   |
|            Search           |      ✔️      |     `users.search`     |
|  Get Authenticated User[^1] |      ✔️      |     `users.getSelf`    |
| Edit Authenticated User[^1] |      ✔️      |    `users.editSelf`    |
|     Get Upload Limit[^1]    |      ✔️      | `users.getUploadLimit` |
|      Get Favorites[^1]      |      ✔️      |  `users.getFavorites`  |
|       Add Favorite[^1]      |      ✔️      |   `users.addFavorite`  |
|     Remove Favorite[^1]     |      ✔️      | `users.removeFavorite` |

[^1]: Requires Authentication
[^2]: Requires Privileged
[^3]: Requires Janitor
[^4]: Requires Moderator
[^5]: Requires Admin
