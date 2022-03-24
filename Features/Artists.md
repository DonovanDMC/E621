## Table Of Contents
- [Index](README.md)
- [Future Plans](FuturePlans.md)
- [E621 Search Inconsistencies](E621SearchInconsistencies.md)
- **Artists**
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
- [Wiki Pages](WikiPages.md)

<hr>

|       Feature      | Implemented |          Method         |
|:------------------:|:-----------:|:-----------------------:|
|      Get By ID     |      ✔️      |      `artists.get`      |
|     Get By Name    |      ✔️      |   `artists.getByName`   |
|       Search       |      ✔️      |     `artists.search`    |
|     Create[^1]     |      ✔️      |     `artists.create`    |
|     Modify[^1]     |      ✔️      |     `artists.modify`    |
|   Delete[^1][^3]   |      ✔️      |     `artists.delete`    |
|     Ban[^1][^5]    |      ✖️      |           N/A           |
|    Unban[^1][^5]   |      ✖️      |           N/A           |
|     Revert[^1]     |      ✔️      |     `artists.revert`    |
|  Get History[^1]   |      ✔️      |  `artists.getHistory`   |
| Search History[^1] |      ✔️      | `artists.searchHistory` |
|    Get DNP List    |      ✔️      |  `artists.getDoNotPost` |

[^1]: Requires Authentication
[^2]: Requires Privileged
[^3]: Requires Janitor
[^4]: Requires Moderator
[^5]: Requires Admin
