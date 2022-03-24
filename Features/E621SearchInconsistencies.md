## Table Of Contents
- [Index](README.md)
- [Future Plans](FuturePlans.md)
- **E621 Search Inconsistencies**
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

### Some of E621's searches are inconsistent with the rest of the site, as such some methods might randomly error if some route doesn't follow standard practices.

Below is a table of all of the routes I can currently think of and what they return

|                        | Object (No Results) | Array (No Results) | Object (With Results) | Array (With Results) |
|:----------------------:|:-------------------:|:------------------:|:---------------------:|:--------------------:|
|         `posts`        |          ✔️          |                    |           ✔️           |                      |
|   `post_disapprovals`  |          ✔️          |                    |          [^1]         |         [^1]         |
|   `post_versions`[^2]  |          ✖️          |          ✖️         |                       |           ✔️          |
|    `post_approvals`    |          ✔️          |                    |                       |           ✔️          |
|      `post_flags`      |          ✔️          |                    |                       |           ✔️          |
|         `notes`        |          ✔️          |                    |                       |           ✔️          |
|     `note_versions`    |          ✔️          |                    |                       |           ✔️          |
|         `pools`        |                     |          ✔️         |                       |           ✔️          |
|   `pool_versions`[^2]  |          ✖️          |          ✖️         |                       |           ✔️          |
|      `wiki_pages`      |                     |          ✔️         |                       |           ✔️          |
|  `wiki_page_versions`  |          ✔️          |                    |                       |           ✔️          |
|        `artists`       |                     |          ✔️         |                       |           ✔️          |
|    `artist_versions`   |          ✔️          |                    |                       |           ✔️          |
|         `tags`         |          ✔️          |                    |                       |           ✔️          |
|   `tag_type_versions`  |          ✔️          |                    |                       |           ✔️          |
|      `tag_aliases`     |          ✔️          |                    |                       |           ✔️          |
|   `tag_implications`   |          ✔️          |                    |                       |           ✔️          |
| `bulk_update_requests` |          ✔️          |                    |                       |           ✔️          |
|         `blips`        |          ✔️          |                    |                       |           ✔️          |
|       `takedowns`      |          ✔️          |                    |                       |           ✔️          |
|         `users`        |                     |          ✔️         |                       |           ✔️          |
|    `user_feedbacks`    |          ✔️          |                    |                       |           ✔️          |
|     `forum_topics`     |                     |          ✔️         |                       |           ✔️          |
|       `post_sets`      |          ✔️          |                    |                       |           ✔️          |
|     `comments`[^3]     |          ✖️          |          ✖️         |           ✖️           |           ✖️          |

[^1]: untested
[^2]: these error when attempting to search for something that has no results
[^3]: `/comments.json` seems to return `/posts.json` results , with most search parameters returning errors.


I've [submitted an issue](https://github.com/zwagoth/e621ng/issues/359) to E621 to see if they have any plans to do something about this. If you find something erroring when you believe it shouldn't (something like `reading property map of undefined`), let us know via an [issue](https://github.com/DonovanDMC/E621/issues/new). 
