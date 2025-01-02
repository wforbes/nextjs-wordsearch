import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Home from '../page';
import { en } from '@/i18n/en';

describe('Home Page', () => {
	it('renders the main heading', () => {
		render(<Home />);
		const heading = screen.getByRole('heading', { name: en.pages.home.title, level: 1 });
		expect(heading).toBeDefined();
	});

	it('renders the subtitle', () => {
		render(<Home />);
		const subtitle = screen.getByRole('heading', { name: en.pages.home.subtitle, level: 2 });
		expect(subtitle).toBeDefined();
	});

	it('renders the start button', () => {
		render(<Home />);
		const button = screen.getByRole('button', { name: en.pages.home.startButton });
		expect(button).toBeDefined();
	});

	it('navigates to game page when start button is clicked', () => {
		render(<Home />);
		const button = screen.getByRole('button', { name: en.pages.home.startButton });
		
		fireEvent.click(button);
		
		expect(mockRouter.asPath).toBe('/game');
	});
});