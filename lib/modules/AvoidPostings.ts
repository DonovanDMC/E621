import {
    avoidPostings_create,
    avoidPostings_delete,
    avoidPostings_destroy,
    avoidPostings_update,
    avoidPostings_show,
    avoidPostings_index,
    avoidPostings_undelete,
} from "../generated/sdk.js";
import AvoidPosting from "../models/AvoidPosting.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { AvoidPostingsCreateData, AvoidPostingsUpdateData, AvoidPostingsIndexData } from "../generated/types.js";

// The `artist_attributes` sub-object is doubly-nested (`avoid_posting[artist_attributes][name]`) - the
// generic bracket-stripping `TransformDataBodyToOptions` only understands one level of nesting, so these
// fields are pulled out and typed/flattened by hand instead (see `create`/`update` below).
type CreateAvoidPostingBody = NonNullable<AvoidPostingsCreateData["body"]>;
type UpdateAvoidPostingBody = NonNullable<AvoidPostingsUpdateData["body"]>;

/** @category Modules/Types */
export interface AvoidPostingArtistAttributes {
    group_name?: CreateAvoidPostingBody["avoid_posting[artist_attributes][group_name]"];
    linked_user_id?: CreateAvoidPostingBody["avoid_posting[artist_attributes][linked_user_id]"];
    name: CreateAvoidPostingBody["avoid_posting[artist_attributes][name]"];
    other_names?: CreateAvoidPostingBody["avoid_posting[artist_attributes][other_names][]"];
    other_names_string?: CreateAvoidPostingBody["avoid_posting[artist_attributes][other_names_string]"];
}

/** Mangled (bracket-stripped) names {@link TransformDataBodyToOptions} produces for the doubly-nested `artist_attributes` keys - excluded so the clean, hand-typed `artist_attributes` field can take their place. */
type MangledArtistAttributesKeys = "artist_attributes][name" | "artist_attributes][other_names_string" | "artist_attributes][other_names" | "artist_attributes][group_name" | "artist_attributes][linked_user_id";

/** @category Modules/Types */
export interface CreateAvoidPostingOptions extends Omit<TransformDataBodyToOptions<AvoidPostingsCreateData>, MangledArtistAttributesKeys> {
    artist_attributes: AvoidPostingArtistAttributes;
}
/** @category Modules/Types */
export interface UpdateAvoidPostingOptions extends Omit<TransformDataBodyToOptions<AvoidPostingsUpdateData>, MangledArtistAttributesKeys> {
    artist_attributes?: Partial<AvoidPostingArtistAttributes>;
}
/** @category Modules/Types */
export interface SearchAvoidPostingsOptions extends TransformDataQueryToOptions<AvoidPostingsIndexData> {}

function flattenArtistAttributes(artist_attributes?: Partial<AvoidPostingArtistAttributes>): Partial<UpdateAvoidPostingBody> {
    if (!artist_attributes) return {};
    return {
        "avoid_posting[artist_attributes][name]": artist_attributes.name,
        "avoid_posting[artist_attributes][other_names_string]": artist_attributes.other_names_string,
        "avoid_posting[artist_attributes][other_names][]": artist_attributes.other_names,
        "avoid_posting[artist_attributes][group_name]": artist_attributes.group_name,
        "avoid_posting[artist_attributes][linked_user_id]": artist_attributes.linked_user_id,
    };
}

/** @category Modules */
export default class AvoidPostings extends Base {
    static readonly moduleKey = "avoidPostings" as const;
    @OperationID("avoid_postings#create")
    async create(options: CreateAvoidPostingOptions): Promise<AvoidPosting> {
        const { artist_attributes, ...rest } = options;
        return avoidPostings_create({
            client: this.client,
            body: {
                ...prefixKeys(rest, "avoid_posting"),
                ...flattenArtistAttributes(artist_attributes),
            } as CreateAvoidPostingBody,
        }).then(res => this._handleResponse(res, 201, true, AvoidPosting));
    }

    @OperationID("avoid_postings#delete")
    async delete(idOrName: string | number): Promise<null> {
        return avoidPostings_delete({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("avoid_postings#destroy")
    async destroy(idOrName: string | number): Promise<null> {
        return avoidPostings_destroy({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("avoid_postings#show")
    async get(idOrName: number | string): Promise<AvoidPosting | null> {
        return avoidPostings_show({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 200, false, AvoidPosting));
    }

    @OperationID("avoid_postings#index")
    async search(options?: SearchAvoidPostingsOptions): Promise<Array<AvoidPosting>> {
        return avoidPostings_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, AvoidPosting));
    }

    @OperationID("avoid_postings#undelete")
    async undelete(idOrName: string | number): Promise<null> {
        return avoidPostings_undelete({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("avoid_postings#update")
    async update(idOrName: string | number, options?: UpdateAvoidPostingOptions): Promise<null> {
        const { artist_attributes, ...rest } = options ?? {};
        return avoidPostings_update({
            client: this.client,
            path: { idOrName },
            body: {
                ...prefixKeys(rest, "avoid_posting"),
                ...flattenArtistAttributes(artist_attributes),
            },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
