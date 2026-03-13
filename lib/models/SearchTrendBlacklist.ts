import Base from "./Base.js";
import type { SearchTrendBlacklist as SearchTrendBlacklistData } from "../generated/types.js";
import { Schema } from "../util.js";

interface SearchTrendBlacklist extends SearchTrendBlacklistData {}
/** @category Models */
@Schema("SearchTrendBlacklist")
class SearchTrendBlacklist extends Base<SearchTrendBlacklistData> {}

export default SearchTrendBlacklist;
