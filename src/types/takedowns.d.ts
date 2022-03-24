import type { GenericSearchOptions } from ".";

type TakedownStatus = "pending" | "inactive" | "denied" | "partial" | "approved";
export interface TakedownProperties {
	id: number;
	status: TakedownStatus;
	approver_id: number | null;
	reason_hidden: boolean;
	created_at: string;
	updated_at: string;
	post_count: number;
}

type SearchTakedownsOrder = "date" | "source" | "email" | "ip_addr" | "status" | "post_count";
// yes, all but status require admin
export interface SearchTakedownsOptions extends GenericSearchOptions {
	status?: TakedownStatus;
	/** requires admin */
	source?: string;
	/** requires admin */
	reason?: string;
	/** requires admin */
	admin_response?: string;
	/** requires admin */
	reason_hidden?: boolean;
	/** requires admin */
	instructions?: string;
	/** requires admin */
	post_id?: number;
	/** requires admin */
	email?: string;
	/** requires admin */
	ip_address?: string;
	/** requires admin */
	vericode?: string;
	/** requires admin */
	order?: SearchTakedownsOrder;
}

// all sent booleans here have shown as 0/1 during testing
export interface CreateTakedownOptions {
	source: string;
	email: string;
	/** post ids or full post urls */
	post_ids?: number | Array<number> | string | Array<string>;
	instructions?: string;
	reason: string;
	reason_hidden?: boolean;
}

// PUT
export interface ModifyTakedownOptions {
	process_takedown?: boolean;
	delete_reason?: string;
	/** object of id-boolean values, false = keep, true = delete */
	takedown_posts?: Record<string | number, boolean>;
	takedown_add_posts_tags?: string | Array<string>;
	takedown_add_posts_ids?: number | Array<number>;
	status?: "pending" | "inactive";
	notes?: string;
	reason_hidden?: boolean;
}
