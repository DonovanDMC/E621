export declare class APIError extends Error {
    code: number;
    errmessage: string;
    method: string;
    endpoint: string;
    constructor(code: number, message: string, method: string, endpoint: string);
}
export interface Post {
    id: string;
    created_at: string;
    updated_at: string;
    file: {
        width: number;
        height: number;
        ext: string;
        md5: string;
        url: string;
    };
    preview: {
        width: number;
        height: number;
        url: string;
    };
    sample: {
        has: boolean;
        height: number;
        width: number;
        url: string;
        alternates: {};
    };
    score: {
        up: number;
        down: number;
        total: number;
    };
    tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", string[]>;
    locked_tags: string[];
    change_seq: number;
    flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
    rating: "s" | "q" | "e";
    fav_count: number;
    sources: string[];
    pools: number[];
    relationships: {
        parent_id: number | null;
        has_children: boolean;
        has_active_children: boolean;
        children: number[];
    };
    approver_id: number | null;
    uploader_id: number | null;
    description: string;
    comment_count: number;
    is_favorited: boolean;
    has_notes: boolean;
    duration: number | null;
}
export interface NullableURLPost {
    id: string;
    created_at: string;
    updated_at: string;
    file: {
        width: number;
        height: number;
        ext: string;
        md5: string;
        url: string | null;
    };
    preview: {
        width: number;
        height: number;
        url: string | null;
    };
    sample: {
        has: boolean;
        height: number;
        width: number;
        url: string | null;
        alternates: {};
    };
    score: {
        up: number;
        down: number;
        total: number;
    };
    tags: Record<"general" | "species" | "character" | "copyright" | "artist" | "invalid" | "lore" | "meta", string[]>;
    locked_tags: string[];
    change_seq: number;
    flags: Record<"pending" | "flagged" | "note_locked" | "status_locked" | "rating_locked" | "deleted", boolean>;
    rating: "s" | "q" | "e";
    fav_count: number;
    sources: string[];
    pools: number[];
    relationships: {
        parent_id: number | null;
        has_children: boolean;
        has_active_children: boolean;
        children: number[];
    };
    approver_id: number | null;
    uploader_id: number | null;
    description: string;
    comment_count: number;
    is_favorited: boolean;
    has_notes: boolean;
    duration: number | null;
}
declare class E621<N extends boolean = true> {
    apiKey: string | null;
    blacklist: string[];
    userAgent: string;
    fixNullURLs: boolean;
    constructor(apiKey?: string, blacklist?: string[], userAgent?: string, fixNullURLs?: N);
    getPosts(tags?: string[], limit?: number, page?: number | string): Promise<(N extends true ? Post : NullableURLPost)[]>;
    getPostById(id: number): Promise<(N extends true ? Post : NullableURLPost)>;
    getPostByMD5(md5: string): Promise<(N extends true ? Post : NullableURLPost)>;
    private filterPosts;
    /**
     * Convert null urls on a post into proper urls.
     * @param {NullableURLPost} p - The post to fix
     * @returns {Post}
     */
    fixURL(p: NullableURLPost): Post;
    /**
     * Construct a url from its md5 counterpart
     * @param {string} md5 - the md5
     * @param {string} [ext="png"] - The extension, assumed png if not provided
     * @param {boolean} [preview=false]
     */
    constructURLFromMD5(md5: string, ext?: string, preview?: boolean): string;
}
export default E621;
export { E621 };
