import { useState, useCallback, useEffect } from "react";
import { WordGrid } from "../WordGrid/WordGrid";
import { WordList } from "../WordList/WordList";
import { Cell, WordLocation } from "../../types/game";
import {
	GRID_SIZE,
	WORD_COUNT,
	SAMPLE_WORDS,
	canPlaceWord,
	placeWord,
} from "../../utils/gameUtils";

type GameControllerProps = {
	onGameWon: () => void;
	gameKey: number;
};

export function GameController({ onGameWon, gameKey }: GameControllerProps) {
	const [grid, setGrid] = useState<Cell[][]>([]);
	const [wordLocations, setWordLocations] = useState<WordLocation[]>([]);

	const initializeGame = useCallback(() => {
		// Create empty grid
		const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
			Array(GRID_SIZE).fill(null).map(() => ({
				letter: "",
				isSelected: false,
				isFound: false,
			}))
		);

		// Select random words
		const selectedWords = [...SAMPLE_WORDS]
			.sort(() => Math.random() - 0.5)
			.slice(0, WORD_COUNT);

		const newWordLocations: WordLocation[] = [];

		// Place words in grid
		selectedWords.forEach((word) => {
			let placed = false;
			let attempts = 0;
			const maxAttempts = 100;

			while (!placed && attempts < maxAttempts) {
				const direction = Math.floor(Math.random() * 3);
				const row = Math.floor(Math.random() * GRID_SIZE);
				const col = Math.floor(Math.random() * GRID_SIZE);

				if (canPlaceWord(word, row, col, direction, newGrid)) {
					const cells = placeWord(word, row, col, direction, newGrid);
					newWordLocations.push({ word, found: false, cells });
					placed = true;
				}
				attempts++;
			}
		});

		// Fill remaining cells with random letters
		for (let i = 0; i < GRID_SIZE; i++) {
			for (let j = 0; j < GRID_SIZE; j++) {
				if (!newGrid[i][j].letter) {
					newGrid[i][j].letter = String.fromCharCode(
						65 + Math.floor(Math.random() * 26)
					);
				}
			}
		}

		setGrid(newGrid);
		setWordLocations(newWordLocations);
	}, []);

	useEffect(() => {
		initializeGame();
	}, [initializeGame]);

	const handleWordFound = (word: string) => {
		const wordLocation = wordLocations.find(
			(wl) => !wl.found && (wl.word === word || wl.word === word.split("").reverse().join(""))
		);

		if (wordLocation) {
			const newGrid = [...grid];
			wordLocation.cells.forEach(({ row, col }) => {
				newGrid[row][col].isFound = true;
			});
			setGrid(newGrid);

			const newWordLocations = wordLocations.map((wl) =>
				wl.word === wordLocation.word ? { ...wl, found: true } : wl
			);
			setWordLocations(newWordLocations);

			if (newWordLocations.every((wl) => wl.found)) {
				onGameWon();
			}
		}
	};

	return (
		<div className="flex gap-8 flex-col md:flex-row">
			<WordGrid
				grid={grid}
				onWordFound={handleWordFound}
				wordLocations={wordLocations}
			/>
			<WordList words={wordLocations} />
		</div>
	);
}