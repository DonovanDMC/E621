import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostVote as PostVoteData } from "../generated/types.js";

interface PostVote extends PostVoteData {}
/** @category Models */
@Schema("PostVote")
class PostVote extends Base<PostVoteData> {
    @OperationID("deletePostVote")
    async delete(): Promise<null> {
        return this.e621.posts.votes.delete(this.post_id);
    }

    @OperationID("lockPostVotes")
    async lock(): Promise<null> {
        return this.e621.postVotes.lock([this.id]);
    }

    @OperationID("deletePostVotes")
    async staffDelete(): Promise<null> {
        return this.e621.postVotes.delete([this.id]);
    }
}

export default PostVote;
