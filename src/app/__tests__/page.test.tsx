import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

	it('renders with the correct layout classes', () => {
		render(<Home />);
		const container = screen.getByTestId('home-container');
		const classes = container.className;
		expect(classes).toContain('min-h-screen');
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-col');
		expect(classes).toContain('items-center');
		expect(classes).toContain('justify-center');
	});
});