import type { GenericSearchOptions } from ".";

export type FeedbackCategories = "positive" | "neutral" | "negative";
export interface UserFeedbackProperties {
	id: number;
	user_id: number;
	creator_id: number;
	created_at: string;
	body: string;
	category: FeedbackCategories;
	updated_at: string;
}

export interface SearchUserFeedbackOptions extends GenericSearchOptions {
	username?: string;
	creator?: string;
	body?: string;
	category?: FeedbackCategories;
}

export interface CreateUserFeedbackOptions {
	username: string;
	category: FeedbackCategories;
	body: string;
}

export type ModifyUserFeedbackOptions = Partial<Omit<CreateUserFeedbackOptions, "user_name">>;
