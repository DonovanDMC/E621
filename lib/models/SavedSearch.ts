import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { SavedSearch as SavedSearchData } from "../generated/types.js";
import type { UpdateSavedSearchOptions } from "../modules/SavedSearches.js";

interface SavedSearch extends SavedSearchData {}
/** @category Models */
@Schema("SavedSearch")
class SavedSearch extends Base<SavedSearchData> {
    @OperationID("saved_searches#destroy")
    async delete(): Promise<null> {
        return this.e621.savedSearches.delete(this.id);
    }

    @OperationID("saved_searches#update")
    async update(options: UpdateSavedSearchOptions): Promise<SavedSearch> {
        return this.e621.savedSearches.update(this.id, options);
    }
}

export default SavedSearch;
