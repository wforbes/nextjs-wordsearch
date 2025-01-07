import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Dashboard from '../page';
import { en } from '@/i18n/en';

describe('Home Page', () => {
	it('renders the main heading', () => {
		render(<Dashboard />);
		const heading = screen.getByRole('heading', { name: en.pages.dashboard.title, level: 1 });
		expect(heading).toBeDefined();
	});

	it('renders the start button', () => {
		render(<Dashboard />);
		const button = screen.getByRole('button', { name: en.pages.dashboard.startButton });
		expect(button).toBeDefined();
	});

	it('navigates to game page when start button is clicked', () => {
		render(<Dashboard />);
		const button = screen.getByRole('button', { name: en.pages.dashboard.startButton });
		
		fireEvent.click(button);
		
		expect(mockRouter.asPath).toBe('/game');
	});
});