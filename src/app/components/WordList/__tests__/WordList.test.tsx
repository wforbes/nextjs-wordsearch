import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordList } from '../WordList';
import { WordLocation } from '../../../types/game';

describe('WordList', () => {
	const mockWords: WordLocation[] = [
		{ word: 'TEST1', found: false, cells: [] },
		{ word: 'TEST2', found: true, cells: [] },
		{ word: 'TEST3', found: false, cells: [] },
	];

	it('renders the word list title', () => {
		render(<WordList words={mockWords} />);
		expect(screen.getByText('Words to Find:')).toBeDefined();
	});

	it('renders all words', () => {
		render(<WordList words={mockWords} />);
		const wordElements = screen.getAllByTestId('word-item');
		expect(wordElements.length).toBe(3);

		const test1 = screen.getByText('TEST1');
		const test2 = screen.getByText('TEST2');
		const test3 = screen.getByText('TEST3');
		expect(test1).toBeDefined();
		expect(test2).toBeDefined();
		expect(test3).toBeDefined();
	});

	it('applies correct styling to found words', () => {
		render(<WordList words={mockWords} />);
		const wordElements = screen.getAllByTestId('word-item');

		// TEST2 is found, should have line-through style
		expect(wordElements[1].className).includes('line-through');
		expect(wordElements[1].className).includes('text-gray-400');

		// TEST1 and TEST3 are not found, should not have line-through style
		expect(wordElements[0].className).not.includes('line-through');
		expect(wordElements[2].className).not.includes('line-through');
	});
});