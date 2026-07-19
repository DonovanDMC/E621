/* eslint-disable import/order */
import Appeals from "./Appeals.js";
export type * from "./Appeals.js";
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
import DBExports from "./DbExports.js";
export type * from "./DbExports.js";
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
import ForumTopics from "./ForumTopics.js";
export type * from "./ForumTopics.js";
import Health from "./Health.js";
export type * from "./Health.js";
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
import PostVotes from "./PostVotes.js";
export type * from "./PostVotes.js";
import ForumPostVotes from "./ForumPostVotes.js";
export type * from "./ForumPostVotes.js";
import StaffAutomodDMails from "./StaffAutomodDMails.js";
export type * from "./StaffAutomodDMails.js";
import StaffDMails from "./StaffDMails.js";
export type * from "./StaffDMails.js";
import StaffExceptionLogs from "./StaffExceptionLogs.js";
export type * from "./StaffExceptionLogs.js";
import StaffFiles from "./StaffFiles.js";
export type * from "./StaffFiles.js";
import StaffUserCleanups from "./StaffUserCleanups.js";
export type * from "./StaffUserCleanups.js";
import StaffUsers from "./StaffUsers.js";
export type * from "./StaffUsers.js";
import StaffVoteTrends from "./StaffVoteTrends.js";
export type * from "./StaffVoteTrends.js";
import StaffWikis from "./StaffWikis.js";
export type * from "./StaffWikis.js";
import StaffWikiVersions from "./StaffWikiVersions.js";
export type * from "./StaffWikiVersions.js";
import type { Client } from "../generated/client/types.js";
import type E621 from "../index.js";
import type { NoV2Options, PostFormatOptions } from "./posts/Format.js";

/** @category Main */
export interface Modules<PF extends PostFormatOptions = NoV2Options> {
    appeals: Appeals;
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
    dbExports: DBExports;
    dmails: DMails;
    dtext: DText;
    editHistories: EditHistories;
    emailBlacklists: EmailBlacklists;
    favorites: Favorites<PF>;
    forumPosts: ForumPosts;
    forumPostVotes: ForumPostVotes;
    forumTopics: ForumTopics;
    health: Health;
    helpPages: HelpPages;
    ipBans: IpBans;
    iqdb: IqdbQueries<PF>;
    mascots: Mascots;
    modActions: ModActions;
    newsUpdates: NewsUpdates;
    notes: Notes;
    noteVersions: NoteVersions;
    pools: Pools;
    poolVersions: PoolVersions;
    popular: Popular<PF>;
    postApprovals: PostApprovals;
    postDisapprovals: PostDisapprovals;
    postEvents: PostEvents;
    postFlags: PostFlags;
    postReplacements: PostReplacements;
    posts: Posts<PF>;
    postSets: PostSets;
    postVersions: PostVersions;
    postVotes: PostVotes;
    relatedTags: RelatedTags;
    searchTrendBlacklists: SearchTrendBlacklists;
    searchTrends: SearchTrends;
    staffAutomodDMails: StaffAutomodDMails;
    staffDmails: StaffDMails;
    staffExceptionLogs: StaffExceptionLogs;
    staffFiles: StaffFiles;
    staffNotes: StaffNotes;
    staffUserCleanups: StaffUserCleanups;
    staffUsers: StaffUsers;
    staffVoteTrends: StaffVoteTrends;
    staffWikis: StaffWikis;
    staffWikiVersions: StaffWikiVersions;
    tagAliases: TagAliases;
    tagCorrections: TagCorrections;
    tagImplications: TagImplications;
    tags: Tags;
    tagTypeVersions: TagTypeVersions;
    takedowns: Takedowns;
    tickets: Tickets;
    uploads: Uploads<PF>;
    uploadWhitelists: UploadWhitelists;
    userFeedbacks: UserFeedbacks;
    userNameChangeRequests: UserNameChangeRequests;
    users: Users;
    wikiPages: WikiPages;
    wikiPageVersions: WikiPageVersions;
}

export function apply<PF extends PostFormatOptions = NoV2Options>(e621: E621<PF>, client: Client, defaultPostFormat: PF = {} as PF): void {
    // Every module below except the post-format-aware ones (favorites/iqdb/popular/posts/uploads) is
    // generic over PF only via Base's default type param - cast down to the bare E621 type to satisfy them.
    const baseE621 = e621 as unknown as E621;
    const modules: Modules<PF> = {
        appeals: new Appeals(baseE621, client),
        artistUrls: new ArtistUrls(baseE621, client),
        artistVersions: new ArtistVersions(baseE621, client),
        artists: new Artists(baseE621, client),
        avoidPostingVersions: new AvoidPostingVersions(baseE621, client),
        avoidPostings: new AvoidPostings(baseE621, client),
        bans: new Bans(baseE621, client),
        blips: new Blips(baseE621, client),
        bulkUpdateRequests: new BulkUpdateRequests(baseE621, client),
        commentVotes: new CommentVotes(baseE621, client),
        comments: new Comments(baseE621, client),
        dbExports: new DBExports(baseE621, client),
        dmails: new DMails(baseE621, client),
        dtext: new DText(baseE621, client),
        editHistories: new EditHistories(baseE621, client),
        emailBlacklists: new EmailBlacklists(baseE621, client),
        favorites: new Favorites(e621, client, defaultPostFormat),
        forumPosts: new ForumPosts(baseE621, client),
        forumPostVotes: new ForumPostVotes(baseE621, client),
        forumTopics: new ForumTopics(baseE621, client),
        health: new Health(baseE621, client),
        helpPages: new HelpPages(baseE621, client),
        ipBans: new IpBans(baseE621, client),
        iqdb: new IqdbQueries(e621, client, defaultPostFormat),
        mascots: new Mascots(baseE621, client),
        modActions: new ModActions(baseE621, client),
        newsUpdates: new NewsUpdates(baseE621, client),
        notes: new Notes(baseE621, client),
        noteVersions: new NoteVersions(baseE621, client),
        pools: new Pools(baseE621, client),
        popular: new Popular(e621, client, defaultPostFormat),
        postApprovals: new PostApprovals(baseE621, client),
        postDisapprovals: new PostDisapprovals(baseE621, client),
        postEvents: new PostEvents(baseE621, client),
        postFlags: new PostFlags(baseE621, client),
        postReplacements: new PostReplacements(baseE621, client),
        poolVersions: new PoolVersions(baseE621, client),
        postSets: new PostSets(baseE621, client),
        postVersions: new PostVersions(baseE621, client),
        postVotes: new PostVotes(baseE621, client),
        posts: new Posts(e621, client, defaultPostFormat),
        relatedTags: new RelatedTags(baseE621, client),
        searchTrendBlacklists: new SearchTrendBlacklists(baseE621, client),
        searchTrends: new SearchTrends(baseE621, client),
        staffAutomodDMails: new StaffAutomodDMails(baseE621, client),
        staffDmails: new StaffDMails(baseE621, client),
        staffExceptionLogs: new StaffExceptionLogs(baseE621, client),
        staffFiles: new StaffFiles(baseE621, client),
        staffNotes: new StaffNotes(baseE621, client),
        staffUserCleanups: new StaffUserCleanups(baseE621, client),
        staffUsers: new StaffUsers(baseE621, client),
        staffVoteTrends: new StaffVoteTrends(baseE621, client),
        staffWikis: new StaffWikis(baseE621, client),
        staffWikiVersions: new StaffWikiVersions(baseE621, client),
        tagAliases: new TagAliases(baseE621, client),
        tagCorrections: new TagCorrections(baseE621, client),
        tagImplications: new TagImplications(baseE621, client),
        tagTypeVersions: new TagTypeVersions(baseE621, client),
        tags: new Tags(baseE621, client),
        takedowns: new Takedowns(baseE621, client),
        tickets: new Tickets(baseE621, client),
        uploads: new Uploads(e621, client),
        uploadWhitelists: new UploadWhitelists(baseE621, client),
        users: new Users(baseE621, client),
        userFeedbacks: new UserFeedbacks(baseE621, client),
        userNameChangeRequests: new UserNameChangeRequests(baseE621, client),
        wikiPages: new WikiPages(baseE621, client),
        wikiPageVersions: new WikiPageVersions(baseE621, client),
    };

    Object.assign(e621, modules);
}
