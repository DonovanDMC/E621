/* eslint-disable import/order */
import AdminUsers from "./admin/Users.js";
export type * from "./admin/Users.js";
import Artists from "./Artists.js";
export type * from "./Artists.js";
import ArtistUrls from "./ArtistUrls.js";
export type * from "./ArtistUrls.js";
import ArtistVersions from "./ArtistVersions.js";
export type * from "./ArtistVersions.js";
import AvoidPostings from "./AvoidPostings.js";
export type * from "./AvoidPostings.js";
import AvoidPostingVersions from "./AvoidPostingVersions.js";
export type * from "./AvoidPostingVersions.js";
import Bans from "./Bans.js";
export type * from "./Bans.js";
import Blips from "./Blips.js";
export type * from "./Blips.js";
import BulkUpdateRequests from "./BulkUpdateRequests.js";
export type * from "./BulkUpdateRequests.js";
import Comments from "./Comments.js";
export type * from "./Comments.js";
export type * from "./comments/Votes.js";
import DMails from "./DMails.js";
export type * from "./DMails.js";
import EditHistories from "./EditHistories.js";
export type * from "./EditHistories.js";
import EmailBlacklists from "./EmailBlacklists.js";
export type * from "./EmailBlacklists.js";
import Favorites from "./Favorites.js";
export type * from "./Favorites.js";
import ForumPosts from "./ForumPosts.js";
export type * from "./ForumPosts.js";
export type * from "./forum_posts/Votes.js";
import ForumTopics from "./ForumTopics.js";
export type * from "./ForumTopics.js";
import HelpPages from "./HelpPages.js";
export type * from "./HelpPages.js";
import IpBans from "./IpBans.js";
export type * from "./IpBans.js";
import IqdbQueries from "./IqdbQueries.js";
export type * from "./IqdbQueries.js";
import Mascots from "./Mascots.js";
export type * from "./Mascots.js";
import ModActions from "./ModActions.js";
export type * from "./ModActions.js";
import NewsUpdates from "./NewsUpdates.js";
export type * from "./NewsUpdates.js";
import Notes from "./Notes.js";
export type * from "./Notes.js";
import NoteVersions from "./NoteVersions.js";
export type * from "./NoteVersions.js";
import Pools from "./Pools.js";
export type * from "./Pools.js";
import PoolVersions from "./PoolVersions.js";
export type * from "./PoolVersions.js";
import Posts from "./Posts.js";
export type * from "./Posts.js";
export type * from "./posts/Flag.js";
export type * from "./posts/Votes.js";
import PostSets from "./PostSets.js";
export type * from "./PostSets.js";
import PostVersions from "./PostVersions.js";
export type * from "./PostVersions.js";
import SearchTrendBlacklists from "./SearchTrendBlacklists.js";
export type * from "./SearchTrendBlacklists.js";
import SearchTrends from "./SearchTrends.js";
export type * from "./SearchTrends.js";
import StaffNotes from "./StaffNotes.js";
export type * from "./StaffNotes.js";
import Tags from "./Tags.js";
export type * from "./Tags.js";
import Takedowns from "./Takedowns.js";
export type * from "./Takedowns.js";
import Tickets from "./Tickets.js";
export type * from "./Tickets.js";
import Uploads from "./Uploads.js";
export type * from "./Uploads.js";
import UploadWhitelists from "./UploadWhitelists.js";
export type * from "./UploadWhitelists.js";
import Users from "./Users.js";
export type * from "./Users.js";
export type * from "./users/DMails.js";
import UserFeedbacks from "./UserFeedbacks.js";
export type * from "./UserFeedbacks.js";
import UserNameChangeRequests from "./UserNameChangeRequests.js";
export type * from "./UserNameChangeRequests.js";
import WikiPages from "./WikiPages.js";
export type * from "./WikiPages.js";
import WikiPageVersions from "./WikiPageVersions.js";
export type * from "./WikiPageVersions.js";
import CommentVotes from "./CommentVotes.js";
export type * from "./CommentVotes.js";
import DText from "./DText.js";
export type * from "./DText.js";
import Popular from "./Popular.js";
export type * from "./Popular.js";
import PostApprovals from "./PostApprovals.js";
export type * from "./PostApprovals.js";
import PostDisapprovals from "./PostDisapprovals.js";
export type * from "./PostDisapprovals.js";
import PostEvents from "./PostEvents.js";
export type * from "./PostEvents.js";
import PostFlags from "./PostFlags.js";
export type * from "./PostFlags.js";
import PostReplacements from "./PostReplacements.js";
export type * from "./PostReplacements.js";
import RelatedTags from "./RelatedTags.js";
export type * from "./RelatedTags.js";
import TagAliases from "./TagAliases.js";
export type * from "./TagAliases.js";
import TagCorrections from "./TagCorrections.js";
export type * from "./TagCorrections.js";
import TagImplications from "./TagImplications.js";
export type * from "./TagImplications.js";
import TagTypeVersions from "./TagTypeVersions.js";
export type * from "./TagTypeVersions.js";
import type { Client } from "../generated/client/types.js";
import type E621 from "../index.js";

/** @category Main */
export interface Modules {
    admin: {
        users: AdminUsers;
    };
    artists: Artists;
    artistUrls: ArtistUrls;
    artistVersions: ArtistVersions;
    avoidPostings: AvoidPostings;
    avoidPostingVersions: AvoidPostingVersions;
    bans: Bans;
    blips: Blips;
    bulkUpdateRequests: BulkUpdateRequests;
    comments: Comments;
    commentVotes: CommentVotes;
    dmails: DMails;
    dtext: DText;
    editHistories: EditHistories;
    emailBlacklists: EmailBlacklists;
    favorites: Favorites;
    forumPosts: ForumPosts;
    forumTopics: ForumTopics;
    helpPages: HelpPages;
    ipBans: IpBans;
    iqdb: IqdbQueries;
    mascots: Mascots;
    modActions: ModActions;
    newsUpdates: NewsUpdates;
    notes: Notes;
    noteVersions: NoteVersions;
    pools: Pools;
    poolVersions: PoolVersions;
    popular: Popular;
    postApprovals: PostApprovals;
    postDisapprovals: PostDisapprovals;
    postEvents: PostEvents;
    postFlags: PostFlags;
    postReplacements: PostReplacements;
    posts: Posts;
    postSets: PostSets;
    postVersions: PostVersions;
    relatedTags: RelatedTags;
    searchTrendBlacklists: SearchTrendBlacklists;
    searchTrends: SearchTrends;
    staffNotes: StaffNotes;
    tagAliases: TagAliases;
    tagCorrections: TagCorrections;
    tagImplications: TagImplications;
    tags: Tags;
    tagTypeVersions: TagTypeVersions;
    takedowns: Takedowns;
    tickets: Tickets;
    uploads: Uploads;
    uploadWhitelists: UploadWhitelists;
    userFeedbacks: UserFeedbacks;
    userNameChangeRequests: UserNameChangeRequests;
    users: Users;
    wikiPages: WikiPages;
    wikiPageVersions: WikiPageVersions;
}

export function apply(e621: E621, client: Client): void {
    const modules: Modules = {
        admin: {
            users: new AdminUsers(e621, client),
        },
        artistUrls: new ArtistUrls(e621, client),
        artistVersions: new ArtistVersions(e621, client),
        artists: new Artists(e621, client),
        avoidPostingVersions: new AvoidPostingVersions(e621, client),
        avoidPostings: new AvoidPostings(e621, client),
        bans: new Bans(e621, client),
        blips: new Blips(e621, client),
        bulkUpdateRequests: new BulkUpdateRequests(e621, client),
        commentVotes: new CommentVotes(e621, client),
        comments: new Comments(e621, client),
        dmails: new DMails(e621, client),
        dtext: new DText(e621, client),
        editHistories: new EditHistories(e621, client),
        emailBlacklists: new EmailBlacklists(e621, client),
        favorites: new Favorites(e621, client),
        forumPosts: new ForumPosts(e621, client),
        forumTopics: new ForumTopics(e621, client),
        helpPages: new HelpPages(e621, client),
        ipBans: new IpBans(e621, client),
        iqdb: new IqdbQueries(e621, client),
        mascots: new Mascots(e621, client),
        modActions: new ModActions(e621, client),
        newsUpdates: new NewsUpdates(e621, client),
        notes: new Notes(e621, client),
        noteVersions: new NoteVersions(e621, client),
        pools: new Pools(e621, client),
        popular: new Popular(e621, client),
        postApprovals: new PostApprovals(e621, client),
        postDisapprovals: new PostDisapprovals(e621, client),
        postEvents: new PostEvents(e621, client),
        postFlags: new PostFlags(e621, client),
        postReplacements: new PostReplacements(e621, client),
        poolVersions: new PoolVersions(e621, client),
        postSets: new PostSets(e621, client),
        postVersions: new PostVersions(e621, client),
        posts: new Posts(e621, client),
        relatedTags: new RelatedTags(e621, client),
        searchTrendBlacklists: new SearchTrendBlacklists(e621, client),
        searchTrends: new SearchTrends(e621, client),
        staffNotes: new StaffNotes(e621, client),
        tagAliases: new TagAliases(e621, client),
        tagCorrections: new TagCorrections(e621, client),
        tagImplications: new TagImplications(e621, client),
        tagTypeVersions: new TagTypeVersions(e621, client),
        tags: new Tags(e621, client),
        takedowns: new Takedowns(e621, client),
        tickets: new Tickets(e621, client),
        uploads: new Uploads(e621, client),
        uploadWhitelists: new UploadWhitelists(e621, client),
        users: new Users(e621, client),
        userFeedbacks: new UserFeedbacks(e621, client),
        userNameChangeRequests: new UserNameChangeRequests(e621, client),
        wikiPages: new WikiPages(e621, client),
        wikiPageVersions: new WikiPageVersions(e621, client),
    };

    Object.assign(e621, modules);
}
