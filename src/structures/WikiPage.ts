import type { WikiPageProperties } from "../types";
import type E621 from "..";

export default class WikiPage implements WikiPageProperties {
	private main: E621;
	id: number;
	creator_id: number;
	creator_name: string;
	category_name: number;
	body: string;
	is_locked: boolean;
	created_at: string;
	updated_at: string;
	updater_id: number;
	other_names: Array<string>;
	is_deleted: boolean;
	constructor(main: E621, info: WikiPageProperties) {
		Object.assign(this, info);
		Object.defineProperty(this, "main", {
			value:        main,
			configurable: false,
			enumerable:   false,
			writable:     false
		});
	}
}
