import { Schema } from "../util.js";

import Base from "./Base.js";

import type { SearchTrend as SearchTrendData } from "../generated/types.js";

interface SearchTrend extends SearchTrendData {}
/** @category Models */
@Schema("SearchTrend")
class SearchTrend extends Base<SearchTrendData> {}

export default SearchTrend;
