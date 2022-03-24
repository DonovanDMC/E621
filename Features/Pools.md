## Table Of Contents
- [Index](README.md)
- [Future Plans](FuturePlans.md)
- [E621 Search Inconsistencies](E621SearchInconsistencies.md)
- [Artists](Artists.md)
- [Blips](Blips.md)
- [Notes](Notes.md)
- **Pools**
- [Post Flags](PostFlags.md)
- [Posts](Posts.md)
- [Post Sets](PostSets.md)
- [Tags](Tags.md)
- [Takedowns](Takedowns.md)
- [User Feedback](UserFeedback.md)
- [Users](Users.md)
- [Wiki Pages](WikiPages.md)

<hr>

|       Feature      | Implemented |         Method        |
|:------------------:|:-----------:|:---------------------:|
|      Get By ID     |      ✔️      |      `pools.get`      |
|     Get By Name    |      ✔️      |   `pools.getByName`   |
|       Search       |      ✔️      |     `pools.search`    |
|     Create[^1]     |      ✔️      |     `pools.create`    |
|     Modify[^1]     |      ✔️      |     `pools.modify`    |
|   Delete[^1][^3]   |      ✔️      |     `pools.delete`    |
|     Revert[^1]     |      ✔️      |     `pools.revert`    |
|  Get History[^1]   |      ✔️      |  `pools.getHistory`   |
| Search History[^1] |      ✔️      | `pools.searchHistory` |
|    Add Post[^1]    |      ✔️      |    `pools.addPost`    |
|   Remove Post[^1]  |      ✔️      |   `pools.removePost`  |

[^1]: Requires Authentication
[^2]: Requires Privileged
[^3]: Requires Janitor
[^4]: Requires Moderator
[^5]: Requires Admin
