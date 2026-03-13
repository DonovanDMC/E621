import Base from "./Base.js";
import type { SearchTrend as SearchTrendData } from "../generated/types.js";
import { Schema } from "../util.js";

interface SearchTrend extends SearchTrendData {}
/** @category Models */
@Schema("SearchTrend")
class SearchTrend extends Base<SearchTrendData> {}

export default SearchTrend;
