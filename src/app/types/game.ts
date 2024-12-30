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