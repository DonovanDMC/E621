import type { GenericSearchOptions } from ".";

export interface NoteProperties {
	id: number;
	post_id: number;
	created_at: string;
	updated_at: string;
	creator_id: number | null;
	creator_name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	version: number;
	is_active: boolean;
	body: string;
}

export interface SearchNotesOptions extends GenericSearchOptions {
	body?: string;
	author?: string;
	tags?: string | Array<string>;
}

// POST /notes/:id.json
export interface CreateNoteOptions {
	post_id: number;
	x: number;
	y: number;
	width: number;
	height: number;
	body: string;
}

export interface ModifyNoteOptions {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	body?: string;
}

export interface NoteHistoryProperties {
	id: number;
	note_id: number;
	post_id: number;
	created_at: string;
	updated_at: string;
	updater_id: number | null;
	x: number;
	y: number;
	width: number;
	height: number;
	body: string;
	version: number;
	is_active: boolean;
}

export interface SearchNoteHistoryOptions extends GenericSearchOptions {
	id?: number;
	note_id?: number;
	post_id?: number;
	body?: string;
}
