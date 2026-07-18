import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostVote as PostVoteData } from "../generated/types.js";

interface PostVote extends PostVoteData {}
/** @category Models */
@Schema("PostVote")
class PostVote extends Base<PostVoteData> {
    @OperationID("post_votes#destroy")
    async delete(): Promise<null> {
        return this.e621.postVotes.unvote(this.post_id);
    }

    @OperationID("post_votes#lock")
    async lock(): Promise<null> {
        return this.e621.postVotes.lock([this.id]);
    }

    @OperationID("post_votes#delete")
    async staffDelete(): Promise<null> {
        return this.e621.postVotes.delete([this.id]);
    }
}

export default PostVote;
