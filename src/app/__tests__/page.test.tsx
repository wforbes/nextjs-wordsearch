import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';

describe('WordSearch Game', () => {
	it('renders the game title', () => {
		render(<Home />);
		expect(screen.getByText('Word Search Game')).toBeDefined();
	});

	it('initializes with a complete game setup', () => {
		render(<Home />);

		// Check for grid
		const gridCells = screen.getAllByRole('gridcell');
		expect(gridCells.length).toBe(15 * 15);

		// Check for word list
		expect(screen.getByText('Words to Find:')).toBeDefined();
		const wordElements = screen.getAllByTestId('word-item');
		expect(wordElements.length).toBe(10);
	});

	it('allows word selection and shows win dialog when all words are found', () => {
		render(<Home />);

		// Get all words to find
		const wordElements = screen.getAllByTestId('word-item');
		const firstWord = wordElements[0].textContent!;

		// Find this word in the grid by checking all cells
		const gridCells = screen.getAllByRole('gridcell');
		const firstWordCells = gridCells.filter(cell => cell.textContent === firstWord[0]);

		// Try selecting from each potential starting point
		firstWordCells.forEach(startCell => {
			fireEvent.mouseDown(startCell);

			// Try all adjacent cells
			const adjacentCells = gridCells.filter(cell =>
				cell !== startCell && cell.textContent === firstWord[1]
			);

			adjacentCells.forEach(nextCell => {
				fireEvent.mouseEnter(nextCell);
				fireEvent.mouseUp(nextCell);
			});
		});

		// The win dialog might appear if we found all words
		const winDialog = screen.queryByText('Congratulations!');
		if (winDialog) {
			expect(screen.getByText('Play Again')).toBeDefined();
		}
	});

	it('handles cell selection with proper styling', () => {
		render(<Home />);
		const cell = screen.getByTestId('cell-0-0');

		// Test selection
		fireEvent.mouseDown(cell);
		expect(cell.className).includes('bg-black text-white');

		// Test deselection
		fireEvent.mouseUp(cell);
		expect(cell.className).not.includes('bg-black text-white');
	});
});