import { Cell, Position } from "../types/game";

export const GRID_SIZE = 15;
export const WORD_COUNT = 10;
export const SAMPLE_WORDS = [
  "NEXT", "REACT", "TYPESCRIPT", "JAVASCRIPT", "TAILWIND",
  "VERCEL", "WEB", "CODE", "GAME", "FUN", "PLAY", "GRID",
  "WORD", "SEARCH", "FIND", "PUZZLE", "LEARN", "BUILD"
];

export function canPlaceWord(
  word: string,
  row: number,
  col: number,
  direction: number,
  grid: Cell[][]
): boolean {
  const dx = [1, 0, 1][direction];
  const dy = [0, 1, 1][direction];

  if (
    row + dy * (word.length - 1) >= GRID_SIZE ||
    col + dx * (word.length - 1) >= GRID_SIZE
  )
    return false;

  for (let i = 0; i < word.length; i++) {
    const currentCell = grid[row + dy * i][col + dx * i];
    if (currentCell.letter && currentCell.letter !== word[i]) {
      return false;
    }
  }

  return true;
}

export function placeWord(
  word: string,
  row: number,
  col: number,
  direction: number,
  grid: Cell[][]
): Position[] {
  const dx = [1, 0, 1][direction];
  const dy = [0, 1, 1][direction];
  const cells: Position[] = [];

  for (let i = 0; i < word.length; i++) {
    grid[row + dy * i][col + dx * i].letter = word[i];
    cells.push({ row: row + dy * i, col: col + dx * i });
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