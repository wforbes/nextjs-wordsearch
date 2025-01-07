export type WordLocation = {
	word: string;
	found: boolean;
	cells: { row: number; col: number }[];
};

export type Cell = {
	letter: string;
	isSelected: boolean;
	isFound: boolean;
};

export type Position = {
	row: number;
	col: number;
};

export type SavedGame = {
	id: string;
	user_id: string;
	grid_state: Cell[][];
	word_locations: WordLocation[];
	created_at: string;
	updated_at: string;
	completed: boolean;
};

export type GameState = {
	grid: Cell[][];
	wordLocations: WordLocation[];
};

export type SavedGameSummary = {
	id: string;
	created_at: string;
	updated_at: string;
	completed: boolean;
	wordCount: number;
	foundWords: number;
};