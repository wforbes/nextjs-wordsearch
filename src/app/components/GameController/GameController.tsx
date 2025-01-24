import { useState, useCallback, useEffect, useRef } from "react";
import { WordGrid } from "../WordGrid/WordGrid";
import { WordList } from "../WordList/WordList";
import { Cell, WordLocation, NewGameOptions } from "../../types/game";
import { loadGame, saveGame } from "@/app/actions/game";
import { en } from "@/i18n/en";
import {
	GRID_SIZE,
	WORD_COUNT,
	SAMPLE_WORDS,
	canPlaceWord,
	placeWord,
	ENABLE_BACKWARD_WORDS,
	Direction,
} from "../../utils/gameUtils";

type GameControllerProps = {
	onGameWon: () => void;
	gameKey: number;
	savedGameId?: string;
	initialOptions?: NewGameOptions;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GameController({ onGameWon, gameKey, savedGameId, initialOptions }: GameControllerProps) {
	const [grid, setGrid] = useState<Cell[][]>([]);
	const [wordLocations, setWordLocations] = useState<WordLocation[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentGameId, setCurrentGameId] = useState<string | undefined>(savedGameId);
	const isInitialized = useRef(false);

	const initializeGame = useCallback(() => {
		const gameOptions = initialOptions || {
			gridSize: GRID_SIZE,
			wordCount: WORD_COUNT,
			wordList: SAMPLE_WORDS,
			enableBackwardWords: ENABLE_BACKWARD_WORDS
		};

		// Validate grid size and word count
		const validatedOptions = {
			...gameOptions,
			gridSize: Math.max(10, Math.min(20, gameOptions.gridSize)),
			wordCount: Math.min(gameOptions.wordCount, Math.floor(gameOptions.gridSize * 1.5))
		};

		const newGrid: Cell[][] = Array(validatedOptions.gridSize).fill(null).map(() =>
			Array(validatedOptions.gridSize).fill(null).map(() => ({
				letter: "",
				isSelected: false,
				isFound: false,
			}))
		);

		const selectedWords = [...validatedOptions.wordList]
			.filter(item => item.active)  // Only use active words
			.sort(() => Math.random() - 0.5)
			.slice(0, validatedOptions.wordCount)
			.map(item => item.word);  // Extract just the word string

		const newWordLocations: WordLocation[] = [];

		selectedWords.forEach((word) => {
			let placed = false;
			let attempts = 0;
			const maxAttempts = 100;

			while (!placed && attempts < maxAttempts) {
				const direction = validatedOptions.enableBackwardWords 
					? Math.floor(Math.random() * Object.keys(Direction).length / 2)
					: Math.floor(Math.random() * 3);
				
				// Use validated grid size for random position
				const row = Math.floor(Math.random() * validatedOptions.gridSize);
				const col = Math.floor(Math.random() * validatedOptions.gridSize);

				if (canPlaceWord(word, row, col, direction, newGrid)) {
					const cells = placeWord(word, row, col, direction, newGrid);
					newWordLocations.push({ word, found: false, cells });
					placed = true;
				}
				attempts++;
			}
		});

		// Fill remaining cells
		for (let i = 0; i < validatedOptions.gridSize; i++) {
			for (let j = 0; j < validatedOptions.gridSize; j++) {
				if (!newGrid[i][j].letter) {
					newGrid[i][j].letter = String.fromCharCode(
						65 + Math.floor(Math.random() * 26)
					);
				}
			}
		}

		setGrid(newGrid);
		setWordLocations(newWordLocations);
		
		return { grid: newGrid, wordLocations: newWordLocations };
	}, [initialOptions]);

	const loadSavedGame = useCallback(async (id: string) => {
		setIsLoading(true);
		try {
			const savedGame = await loadGame(id);
			setGrid(savedGame.grid_state);
			setWordLocations(savedGame.word_locations);
		} catch (err) {
			setError('Failed to load saved game');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		const setupGame = async () => {
			if (savedGameId) {
				await loadSavedGame(savedGameId);
			} else {
				// Initialize new game and get the state
				const newGameState = initializeGame();
				
				// Save the newly initialized game with the actual state
				setIsLoading(true);
				try {
					const savedGame = await saveGame(newGameState);
					setCurrentGameId(savedGame.id);
					window.history.replaceState({}, '', `/game?id=${savedGame.id}`);
				} catch (err) {
					setError('Failed to create game');
					console.error(err);
				} finally {
					setIsLoading(false);
				}
			}
		};

		if (!isInitialized.current) {
			setupGame();
			isInitialized.current = true;
		}
	}, [savedGameId, initializeGame, loadSavedGame]);  // Remove grid and wordLocations from deps

	const handleSave = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await saveGame(
				{ grid, wordLocations },
				currentGameId
			);
		} catch (err) {
			setError('Failed to save game');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleWordFound = async (word: string) => {
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

			// If all words are found, save game before showing win dialog
			if (newWordLocations.every(wl => wl.found)) {
				try {
					await saveGame(
						{ grid: newGrid, wordLocations: newWordLocations },
						currentGameId
					);
				} catch (err) {
					console.error('Failed to save completed game:', err);
				}
				onGameWon();
			}
		}
	};

	return (
		<div className="flex gap-8 flex-col md:flex-row">
			<div className="flex flex-col gap-4">
				<WordGrid
					grid={grid}
					onWordFound={handleWordFound}
					wordLocations={wordLocations}
				/>
				<button
					onClick={handleSave}
					disabled={isLoading}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
				>
					{isLoading ? en.pages.game.saveLoading : en.pages.game.saveButton}
				</button>
				{error && <div className="text-red-500">{error}</div>}
			</div>
			<WordList words={wordLocations} />
		</div>
	);
}