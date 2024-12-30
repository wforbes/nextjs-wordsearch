import { useState } from "react";
import { Cell, Position, WordLocation } from "../../types/game";
import { GRID_SIZE, getValidSelection } from "../../utils/gameUtils";

type WordGridProps = {
  grid: Cell[][];
  onWordFound: (word: string) => void;
  wordLocations: WordLocation[];
};

export function WordGrid({ grid, onWordFound, wordLocations }: WordGridProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [godMode, setGodMode] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells((prev) => {
        const newSelection = [...prev, { row, col }];
        return getValidSelection(newSelection);
      });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    const selectedWord = selectedCells
      .map(({ row, col }) => grid[row][col].letter)
      .join("");
    onWordFound(selectedWord);
    setSelectedCells([]);
  };

  const toggleGodMode = () => {
    setGodMode(!godMode);
  };

  const isPartOfWord = (row: number, col: number): boolean => {
    return wordLocations.some(wordLoc => 
      !wordLoc.found &&
      wordLoc.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="grid gap-0.5 bg-gray-200"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-testid={`cell-${rowIndex}-${colIndex}`}
              role="gridcell"
              className={`w-8 h-8 flex items-center justify-center font-bold cursor-pointer select-none transition-colors
                ${
                  cell.isFound
                    ? "bg-gray-300"
                    : selectedCells.some(
                        (sc) => sc.row === rowIndex && sc.col === colIndex
                      )
                    ? "bg-black text-white"
                    : godMode && isPartOfWord(rowIndex, colIndex)
                    ? "bg-green-100"
                    : "bg-white"
                }`}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleMouseUp}
            >
              {cell.letter}
            </div>
          ))
        )}
      </div>
      <button
        onClick={toggleGodMode}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors w-fit"
      >
        {godMode ? "Disable" : "Enable"} God Mode
      </button>
    </div>
  );
} 