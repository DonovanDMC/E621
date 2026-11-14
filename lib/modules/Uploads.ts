import { uploads_show, uploads_index, uploads_create } from "e621-openapi/sdk";

import Upload from "../models/Upload.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type NoV1Options, type PostFormat, type PostFormatOptions } from "./posts/Format.js";

import type { UploadsIndexData, UploadsCreateData } from "e621-openapi/types";

/** @category Modules/Types */
export interface SearchUploadsOptions extends TransformDataQueryToOptions<UploadsIndexData> {}
/** @category Modules/Types */
export interface UploadPostOptions extends TransformDataBodyToOptions<UploadsCreateData> {}
/** @category Modules/Types */
export interface WaitForUploadOptions {
    /**
     * Seconds between each check of the upload's status.
     * @default 2
     */
    interval?: number;
    /**
     * Seconds to wait for the upload to finish processing before giving up.
     * @default 300
     */
    timeout?: number;
}

/** @category Modules */
export default class Uploads<PF extends PostFormatOptions = NoV1Options> extends Base<PF> {
    static readonly moduleKey = "uploads" as const;
    /**
     * Uploads are processed asynchronously, if the upload isn't finished right away this waits for it (see {@link Uploads.wait}).
     */
    @OperationID("uploads#create")
    async create(options: UploadPostOptions, waitOptions?: WaitForUploadOptions): Promise<PostFormat<PF["v1"], PF["mode"]>> {
        return uploads_create({
            client: this.client,
            body: prefixKeys(options, "upload"),
        }).then(async (res) => {
            const data = this._handleResponse(res, 200, true);
            const postID = data.post_id ?? (await this.wait(data.upload_id, waitOptions)).post_id!;
            const post = await this.e621.posts.get(postID);
            if (post === null) throw new Error(`Post not found after upload: ${postID}`);
            return post as PostFormat<PF["v1"], PF["mode"]>;
        });
    }

    @OperationID("uploads#show")
    async get(id: number): Promise<Upload | null> {
        return uploads_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Upload));
    }

    @OperationID("uploads#index")
    async search(options?: SearchUploadsOptions): Promise<Array<Upload>> {
        return uploads_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Upload));
    }

    /**
     * Waits for an upload to finish processing. Throws if it fails, turns out to be a duplicate, or doesn't finish within the timeout.
     */
    @OperationID("uploads#show")
    async wait(id: number, options?: WaitForUploadOptions): Promise<Upload> {
        const interval = (options?.interval ?? 2) * 1000;
        const deadline = Date.now() + (options?.timeout ?? 300) * 1000;
        for (;;) {
            const upload = await this.get(id);
            if (upload === null) throw new Error(`Upload not found: ${id}`);
            if (upload.status === "completed" && upload.post_id !== null) return upload;
            if (upload.status === "failed") throw new Error(`Upload ${id} failed: ${upload.error_message ?? "unknown error"}`);
            if (upload.status.startsWith("duplicate")) throw new Error(`Upload ${id} is a duplicate of post #${upload.duplicate_post_id}`);
            if (Date.now() + interval > deadline) throw new Error(`Upload ${id} did not finish processing in time (status: ${upload.status})`);
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
}
