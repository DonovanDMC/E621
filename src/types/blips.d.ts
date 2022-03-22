import type { GenericSearchOptions } from ".";

export interface BlipProperties {
	id: number;
	creator_id: number;
	creator_name: string;
	body: string;
	response_to: number | null;
	created_at: string;
	updated_at: string;
	is_hidden: boolean;
	/** the type of warning shown on this blip - 1 = warning - 2 = record - 3 = ban */
	warning_type: 1 | 2 | 3;
	/** the user that created the warning present on the blip  */
	warning_user_id: number | null;
}

export type SearchBlipsOrder = "id_desc" | "updated_at_desc";
export interface SearchBlipsOptions extends GenericSearchOptions {
	creator?: string;
	creator_id?: string;
	body?: string;
	response_to?: number;
	/** requires moderator */
	ip_address?: string;
	order?: SearchBlipsOrder;
}

export interface CreateBlipOptions {
	body: string;
	/** the blip to respond to */
	response_to?: number;
}

export type ModifyBlipOptions = Pick<CreateBlipOptions, "body">;

export type BlipWarningType = "warning"| "record" | "ban";
