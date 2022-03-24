## Table Of Contents
- [Index](README.md)
- **Future Plans**
- [E621 Search Inconsistencies](E621SearchInconsistencies.md)
- [Artists](Artists.md)
- [Blips](Blips.md)
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

|                               Feature                               | Planned |
|:-------------------------------------------------------------------:|:-------:|
|    [Bulk Update Requests](https://e621.net/bulk_update_requests)    |    ✔️    |
|        [Tag Implications](https://e621.net/tag_implications)        |    ✔️    |
|             [Tag Aliases](https://e621.net/tag_aliases)             |    ✔️    |
|                   [Notes](https://e621.net/notes)                   |    ✔️    |
|            [Note History](https://e621.net/note_versions)           |    ✔️    |
|            [Forum Topics](https://e621.net/forum_topics)            |    ✔️    |
|                [Comments](https://e621.net/comments)                |    ✔️    |
|       [Popular Posts](https://e621.net/explore/posts/popular)       |    ✔️    |
|                [IQDB](https://e621.net/iqdb_queries)                |    ✔️    |
|       [Upload Whitelists](https://e621.net/upload_whitelists)       |    ✔️    |
|       [Post Events](https://e621.net/posts/2907536/events)[^3]      |    ✔️    |
|      [Email Blacklists](https://e621.net/email_blacklists)[^2]      |    ✔️    |
|               [IP Bans](https://e621.net/ip_bans)[^2]               |    ✔️    |
|              [Dmails](https://e621.net/dmails)[^1][^6]              |    ➖   |
|         [Mod Actions](https://e621.net/mod_actions)[^1][^5]         |    ➖   |
|               [Tickets](https://e621.net/tickets)[^1]               |    ✖️    |
|                [User Bans](https://e621.net/bans)[^1]               |    ✖️    |
|         [Deleted Posts](https://e621.net/deleted_posts)[^1]         |    ✖️    |
|     [Post Replacements](https://e621.net/post_replacements)[^1]     |    ✖️    |
|                 [Stats](https://e621.net/stats)[^1]                 |    ✖️    |
|      [Edit Histories](https://e621.net/edit_histories)[^1][^2]      |    ✖️    |
| [Post Report Reasons](https://e621.net/post_report_reasons)[^1][^2] |    ✖️    |
|        [Post Appeals](https://e621.net/post_appeals)[^2][^4]        |    ✖️    |

[^1]: E621 does not expose a json api for these, and I will not scrape the html of the page, as this will add serious bloat to the library, and is not something e621 wants us to do.
[^2]: These require a higher user level than [b]Privileged[/b] (which is what I have on e621), so implementing requires hosting a local instance, and is generally slower to do.
[^3]: This feature is not documented and is subject to change soon (see [this pull request](https://github.com/zwagoth/e621ng/issues/346))
[^4]: This feature is unused and is planned to be removed (see [this pull request](https://github.com/zwagoth/e621ng/pull/357))
[^5]: This is being made as a sub-module under [@e621/mod-actions](https://npm.im/@e621/mod-actions), this is currently a work in progress
[^6]: This is being made as a sub-module under [@e621/dmails](https://npm.im/@e621/dmails), this is currently a work in progress
