import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Home from '../page';

describe('Home Page', () => {

	it('renders the main heading', () => {
		render(<Home />);
		const heading = screen.getByRole('heading', { name: 'Word Search Game', level: 1 });
		expect(heading).toBeDefined();
	});

	it('renders the subtitle', () => {
		render(<Home />);
		const subtitle = screen.getByRole('heading', { name: 'Ready to start finding words?', level: 2 });
		expect(subtitle).toBeDefined();
	});

	it('renders the start button', () => {
		render(<Home />);
		const button = screen.getByRole('button', { name: 'Start Searching' });
		expect(button).toBeDefined();
	});

	it('navigates to game page when start button is clicked', () => {
		render(<Home />);
		const button = screen.getByRole('button', { name: 'Start Searching' });
		
		fireEvent.click(button);
		
		expect(mockRouter.asPath).toBe('/game');
	});
});