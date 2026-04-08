import {
    createAvoidPosting,
    deleteAvoidPosting,
    destroyAvoidPosting,
    editAvoidPosting,
    getAvoidPosting,
    searchAvoidPostings,
    undeleteAvoidPosting,
} from "../generated/sdk.js";
import AvoidPosting from "../models/AvoidPosting.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchAvoidPostingsData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateAvoidPostingOptions {
    artist_attributes?: {
        group_name?: string;
        linked_user_id?: number;
        name: string;
        other_names?: Array<string>;
        other_names_string?: string;
    };
    details?: string;
    is_active?: boolean;
    staff_notes?: string;
}
/** @category Modules/Types */
export interface EditAvoidPostingOptions {
    artist_attributes?: {
        group_name?: string;
        linked_user_id?: number;
        name?: string;
        other_names?: Array<string>;
        other_names_string?: string;
    };
    details?: string;
    is_active?: boolean;
    staff_notes?: string;
}
/** @category Modules/Types */
export interface SearchAvoidPostingsOptions extends TransformDataQueryToOptions<SearchAvoidPostingsData> {}

/** @category Modules */
export default class AvoidPostings extends Base {
    @OperationID("createAvoidPosting")
    async create(options?: CreateAvoidPostingOptions): Promise<AvoidPosting> {
        return createAvoidPosting({
            client: this.client,
            body: {
                "avoid_posting[artist_attributes][group_name]": options?.artist_attributes?.group_name,
                "avoid_posting[artist_attributes][linked_user_id]": options?.artist_attributes?.linked_user_id,
                "avoid_posting[artist_attributes][name]": options?.artist_attributes?.name,
                "avoid_posting[artist_attributes][other_names]": options?.artist_attributes?.other_names,
                "avoid_posting[artist_attributes][other_names_string]": options?.artist_attributes?.other_names_string,
                "avoid_posting[details]": options?.details,
                "avoid_posting[is_active]": options?.is_active,
                "avoid_posting[staff_notes]": options?.staff_notes,
            },
        }).then(res => this._handleResponse(res, 201, true, AvoidPosting));
    }

    @OperationID("deleteAvoidPosting")
    async delete(idOrName: string | number): Promise<null> {
        return deleteAvoidPosting({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("destroyAvoidPosting")
    async destroy(idOrName: string | number): Promise<null> {
        return destroyAvoidPosting({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editAvoidPosting")
    async edit(idOrName: string | number, options?: EditAvoidPostingOptions): Promise<null> {
        return editAvoidPosting({
            client: this.client,
            path: { idOrName },
            body: {
                "avoid_posting[artist_attributes][group_name]": options?.artist_attributes?.group_name,
                "avoid_posting[artist_attributes][linked_user_id]": options?.artist_attributes?.linked_user_id,
                "avoid_posting[artist_attributes][name]": options?.artist_attributes?.name,
                "avoid_posting[artist_attributes][other_names]": options?.artist_attributes?.other_names,
                "avoid_posting[artist_attributes][other_names_string]": options?.artist_attributes?.other_names_string,
                "avoid_posting[details]": options?.details,
                "avoid_posting[is_active]": options?.is_active,
                "avoid_posting[staff_notes]": options?.staff_notes,
            },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getAvoidPosting")
    async get(idOrName: number | string): Promise<AvoidPosting | null> {
        return getAvoidPosting({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 200, false, AvoidPosting));
    }

    @OperationID("searchAvoidPostings")
    async search(options?: SearchAvoidPostingsOptions): Promise<Array<AvoidPosting>> {
        return searchAvoidPostings({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, AvoidPosting));
    }

    @OperationID("undeleteAvoidPosting")
    async undelete(idOrName: string | number): Promise<null> {
        return undeleteAvoidPosting({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
