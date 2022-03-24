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
- [Users](Users.md)
- **Wiki Pages**

<hr>

|     Feature    | Implemented |           Method          |
|:--------------:|:-----------:|:-------------------------:|
|    Get By ID   |      ✔️      |      `wikiPages.get`      |
|  Get By Title  |      ✔️      |   `wikiPages.getByTitle`  |
|     Search     |      ✔️      |     `wikiPages.search`    |
|   Create[^1]   |      ✔️      |     `wikiPages.create`    |
|   Modify[^1]   |      ✔️      |     `wikiPages.modify`    |
| Delete[^1][^3] |      ✔️      |     `wikiPages.delete`    |
|   Revert[^1]   |      ✔️      |     `wikiPages.revert`    |
| Search History |      ✔️      | `wikiPages.searchHistory` |
|  Get History   |      ✔️      |  `wikiPages.getHistory`   |

[^1]: Requires Authentication
[^2]: Requires Privileged
[^3]: Requires Janitor
[^4]: Requires Moderator
[^5]: Requires Admin
