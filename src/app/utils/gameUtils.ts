import { Cell, Position, WordListItem } from "../types/game";

export const GRID_SIZE = 15;
export const WORD_COUNT = 10;
export const SAMPLE_WORDS = [
	"NEXT", "REACT", "TYPESCRIPT", "JAVASCRIPT", "TAILWIND",
	"VERCEL", "WEB", "CODE", "GAME", "FUN", "PLAY", "GRID",
	"WORD", "SEARCH", "FIND", "PUZZLE", "LEARN", "BUILD"
].map(word => ({ word, active: true }));

export const ENABLE_BACKWARD_WORDS = true; // Feature flag for backward word placement

export enum Direction {
	HORIZONTAL_RIGHT = 0,
	HORIZONTAL_LEFT = 1,
	VERTICAL_DOWN = 2,
	VERTICAL_UP = 3,
	DIAGONAL_RIGHT_DOWN = 4,
	DIAGONAL_RIGHT_UP = 5,
	DIAGONAL_LEFT_DOWN = 6,
	DIAGONAL_LEFT_UP = 7
}

export function canPlaceWord(word: string, row: number, col: number, direction: Direction, grid: Cell[][]): boolean {
	const length = word.length;
	
	switch (direction) {
		case Direction.HORIZONTAL_RIGHT:
			if (col + length > GRID_SIZE) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row][col + i].letter && grid[row][col + i].letter !== word[i]) return false;
			}
			return true;

		case Direction.HORIZONTAL_LEFT:
			if (col - length + 1 < 0) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row][col - i].letter && grid[row][col - i].letter !== word[i]) return false;
			}
			return true;

		case Direction.VERTICAL_DOWN:
			if (row + length > GRID_SIZE) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row + i][col].letter && grid[row + i][col].letter !== word[i]) return false;
			}
			return true;

		case Direction.VERTICAL_UP:
			if (row - length + 1 < 0) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row - i][col].letter && grid[row - i][col].letter !== word[i]) return false;
			}
			return true;

		case Direction.DIAGONAL_RIGHT_DOWN:
			if (col + length > GRID_SIZE || row + length > GRID_SIZE) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row + i][col + i].letter && grid[row + i][col + i].letter !== word[i]) return false;
			}
			return true;

		case Direction.DIAGONAL_RIGHT_UP:
			if (col + length > GRID_SIZE || row - length + 1 < 0) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row - i][col + i].letter && grid[row - i][col + i].letter !== word[i]) return false;
			}
			return true;

		case Direction.DIAGONAL_LEFT_DOWN:
			if (col - length + 1 < 0 || row + length > GRID_SIZE) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row + i][col - i].letter && grid[row + i][col - i].letter !== word[i]) return false;
			}
			return true;

		case Direction.DIAGONAL_LEFT_UP:
			if (col - length + 1 < 0 || row - length + 1 < 0) return false;
			for (let i = 0; i < length; i++) {
				if (grid[row - i][col - i].letter && grid[row - i][col - i].letter !== word[i]) return false;
			}
			return true;
	}
	return false;
}

export function placeWord(word: string, row: number, col: number, direction: Direction, grid: Cell[][]): { row: number; col: number; }[] {
	const cells: { row: number; col: number; }[] = [];
	const length = word.length;

	switch (direction) {
		case Direction.HORIZONTAL_RIGHT:
			for (let i = 0; i < length; i++) {
				grid[row][col + i].letter = word[i];
				cells.push({ row, col: col + i });
			}
			break;

		case Direction.HORIZONTAL_LEFT:
			for (let i = 0; i < length; i++) {
				grid[row][col - i].letter = word[i];
				cells.push({ row, col: col - i });
			}
			break;

		case Direction.VERTICAL_DOWN:
			for (let i = 0; i < length; i++) {
				grid[row + i][col].letter = word[i];
				cells.push({ row: row + i, col });
			}
			break;

		case Direction.VERTICAL_UP:
			for (let i = 0; i < length; i++) {
				grid[row - i][col].letter = word[i];
				cells.push({ row: row - i, col });
			}
			break;

		case Direction.DIAGONAL_RIGHT_DOWN:
			for (let i = 0; i < length; i++) {
				grid[row + i][col + i].letter = word[i];
				cells.push({ row: row + i, col: col + i });
			}
			break;

		case Direction.DIAGONAL_RIGHT_UP:
			for (let i = 0; i < length; i++) {
				grid[row - i][col + i].letter = word[i];
				cells.push({ row: row - i, col: col + i });
			}
			break;

		case Direction.DIAGONAL_LEFT_DOWN:
			for (let i = 0; i < length; i++) {
				grid[row + i][col - i].letter = word[i];
				cells.push({ row: row + i, col: col - i });
			}
			break;

		case Direction.DIAGONAL_LEFT_UP:
			for (let i = 0; i < length; i++) {
				grid[row - i][col - i].letter = word[i];
				cells.push({ row: row - i, col: col - i });
			}
			break;
	}

	return cells;
}

export function getDirection(start: Position, end: Position) {
	const rowDiff = end.row - start.row;
	const colDiff = end.col - start.col;

	if (rowDiff === 0 && colDiff !== 0) return 'horizontal';
	if (rowDiff !== 0 && colDiff === 0) return 'vertical';
	if (Math.abs(rowDiff) === Math.abs(colDiff)) return 'diagonal';
	return null;
}

export function getValidSelection(cells: Position[]): Position[] {
	if (cells.length <= 1) return cells;

	const start = cells[0];
	const current = cells[cells.length - 1];
	const direction = getDirection(start, current);

	if (!direction) return [start];

	const rowStep = current.row === start.row ? 0 : (current.row - start.row) / Math.abs(current.row - start.row);
	const colStep = current.col === start.col ? 0 : (current.col - start.col) / Math.abs(current.col - start.col);

	const validCells: Position[] = [];
	let currentRow = start.row;
	let currentCol = start.col;

	while (true) {
		validCells.push({ row: currentRow, col: currentCol });

		if (currentRow === current.row && currentCol === current.col) break;

		currentRow += rowStep;
		currentCol += colStep;

		// Safety check to prevent infinite loops
		if (validCells.length > GRID_SIZE * 2) break;
	}

	return validCells;
}

export const calculateGridCapacity = (gridSize: number, wordList: WordListItem[]) => {
	if (wordList.length === 0) return 0;
	
	const totalCells = gridSize * gridSize;
	const avgWordLength = wordList.reduce((sum, item) => sum + item.word.length, 0) / wordList.length;
	const effectiveLetterCount = avgWordLength * 0.8; // Account for intersections
	const spacePerWord = effectiveLetterCount * 1.2; // Account for diagonal placements
	
	const theoreticalMax = Math.floor(totalCells / spacePerWord);
	return Math.floor(theoreticalMax * 0.8); // Safety margin
};

export const isWordValidForGrid = (word: string, gridSize: number): boolean => {
	// Word can't be longer than grid diagonal
	const maxLength = Math.floor(Math.sqrt(2 * gridSize * gridSize));
	return word.length <= maxLength && word.length >= 3;
};