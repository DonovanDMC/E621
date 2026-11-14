import { Schema } from "../util.js";

import Base from "./Base.js";

import type { SearchTrendHourly as SearchTrendHourlyData } from "e621-openapi/types";

interface SearchTrendHourly extends SearchTrendHourlyData {}
/** @category Models */
@Schema("SearchTrendHourly")
class SearchTrendHourly extends Base<SearchTrendHourlyData> {}

export default SearchTrendHourly;
