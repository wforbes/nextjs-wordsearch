import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WordGrid } from '../WordGrid';
import { Cell, WordLocation } from '../../../types/game';

describe('WordGrid', () => {
	const mockGrid: Cell[][] = Array(15).fill(null).map(() =>
		Array(15).fill(null).map(() => ({
			letter: 'A',
			isSelected: false,
			isFound: false,
		}))
	);

	const mockWordLocations: WordLocation[] = [
		{
			word: 'TEST',
			found: false,
			cells: [
				{ row: 0, col: 0 },
				{ row: 0, col: 1 },
				{ row: 0, col: 2 },
				{ row: 0, col: 3 },
			]
		}
	];

	it('renders a 15x15 grid', () => {
		render(
			<WordGrid
				grid={mockGrid}
				onWordFound={() => { }}
				wordLocations={[]}
			/>
		);

		const gridCells = screen.getAllByRole('gridcell');
		expect(gridCells.length).toBe(15 * 15);
	});

	it('handles word selection correctly', () => {
		const mockOnWordFound = vi.fn();
		render(
			<WordGrid
				grid={mockGrid}
				onWordFound={mockOnWordFound}
				wordLocations={[]}
			/>
		);

		const firstCell = screen.getByTestId('cell-0-0');
		const secondCell = screen.getByTestId('cell-0-1');

		// Start selection
		fireEvent.mouseDown(firstCell);
		expect(firstCell.className).includes('bg-black text-white');

		// Continue selection
		fireEvent.mouseEnter(secondCell);
		expect(secondCell.className).includes('bg-black text-white');

		// Complete selection
		fireEvent.mouseUp(secondCell);
		expect(mockOnWordFound).toHaveBeenCalledWith('AA');

		// Verify selection is cleared
		expect(firstCell.className).not.includes('bg-black text-white');
		expect(secondCell.className).not.includes('bg-black text-white');
	});

	it('shows found cells with correct styling', () => {
		const gridWithFoundCell = Array(15).fill(null).map(() =>
			Array(15).fill(null).map(() => ({
				letter: 'A',
				isSelected: false,
				isFound: false,
			}))
		);
		gridWithFoundCell[0][0].isFound = true;

		render(
			<WordGrid
				grid={gridWithFoundCell}
				onWordFound={() => { }}
				wordLocations={[]}
			/>
		);

		const foundCell = screen.getByTestId('cell-0-0');
		expect(foundCell.className).includes('bg-gray-300');
	});

	it('maintains valid selection path', () => {
		render(
			<WordGrid
				grid={mockGrid}
				onWordFound={() => { }}
				wordLocations={[]}
			/>
		);

		const cell00 = screen.getByTestId('cell-0-0');
		const cell01 = screen.getByTestId('cell-0-1');
		const cell11 = screen.getByTestId('cell-1-1');

		// Start selection and create a valid horizontal selection
		fireEvent.mouseDown(cell00);
		fireEvent.mouseEnter(cell01);

		// Verify initial horizontal selection
		expect(cell00.className).includes('bg-black text-white');
		expect(cell01.className).includes('bg-black text-white');

		// Move to diagonal cell - this creates a new valid diagonal selection from start
		fireEvent.mouseEnter(cell11);

		// Should show a valid diagonal selection from cell00 to cell11
		expect(cell00.className).includes('bg-black text-white');
		expect(cell01.className).not.includes('bg-black text-white');
		expect(cell11.className).includes('bg-black text-white');

		// End the selection
		fireEvent.mouseUp(cell11);

		// Test "sloppy" diagonal selection (moving through intermediate cells)
		fireEvent.mouseDown(cell00);

		// Move through a horizontal cell on the way to diagonal
		fireEvent.mouseEnter(cell01);
		fireEvent.mouseEnter(cell11);

		// Should maintain valid diagonal selection despite passing through cell01
		expect(cell00.className).includes('bg-black text-white');
		expect(cell01.className).not.includes('bg-black text-white');
		expect(cell11.className).includes('bg-black text-white');

		fireEvent.mouseUp(cell11);

		// Test another "sloppy" diagonal path
		const cell22 = screen.getByTestId('cell-2-2');

		fireEvent.mouseDown(cell00);
		// Move through both horizontal and vertical cells on the way to diagonal
		fireEvent.mouseEnter(cell01);
		fireEvent.mouseEnter(cell11);
		fireEvent.mouseEnter(cell22);

		// Should show valid diagonal selection from start to end
		expect(cell00.className).includes('bg-black text-white');
		expect(cell01.className).not.includes('bg-black text-white');
		expect(cell11.className).includes('bg-black text-white');
		expect(cell22.className).includes('bg-black text-white');

		fireEvent.mouseUp(cell22);
	});

	it('toggles God Mode highlighting only for word cells', () => {
		render(
			<WordGrid
				grid={mockGrid}
				onWordFound={() => { }}
				wordLocations={mockWordLocations}
			/>
		);

		// Get cells that are and aren't part of the word
		const wordCell = screen.getByTestId('cell-0-0'); // Part of TEST word
		const nonWordCell = screen.getByTestId('cell-1-1'); // Not part of any word

		// Initially, cells should have white background
		expect(wordCell.className).includes('bg-white');
		expect(nonWordCell.className).includes('bg-white');
		expect(wordCell.className).not.includes('bg-green-100');
		expect(nonWordCell.className).not.includes('bg-green-100');

		// Enable God Mode
		const toggleButton = screen.getByText('Enable God Mode');
		fireEvent.click(toggleButton);

		// Only word cells should have green background
		expect(wordCell.className).includes('bg-green-100');
		expect(nonWordCell.className).not.includes('bg-green-100');
		expect(nonWordCell.className).includes('bg-white');

		// Disable God Mode
		fireEvent.click(screen.getByText('Disable God Mode'));

		// All cells should return to white background
		expect(wordCell.className).includes('bg-white');
		expect(nonWordCell.className).includes('bg-white');
		expect(wordCell.className).not.includes('bg-green-100');
		expect(nonWordCell.className).not.includes('bg-green-100');
	});
});