import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { en } from '@/i18n/en';
import mockRouter from 'next-router-mock';
import { mockUser } from '@/test/mockData/auth';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

vi.mock('@/auth', () => ({
	auth: vi.fn().mockImplementation(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		() => async (req: NextRequest) => {
			return mockUser;
		}
	)
}));

vi.mock('next/navigation', () => ({
	redirect: vi.fn()
}));

describe('Home Page', () => {
	beforeEach(() => {
		mockRouter.push('/');
		vi.mocked(auth).mockResolvedValue(null);
	});

	it('renders the main heading', async () => {
		render(await Home());
		const heading = screen.getByRole('heading', { name: en.pages.home.title, level: 1 });
		expect(heading).toBeDefined();
	});

	it('renders the subtitle', async () => {
		render(await Home());
		const subtitle = screen.getByRole('heading', { name: en.pages.home.subtitle, level: 2 });
		expect(subtitle).toBeDefined();
	});

	it('renders with the correct layout classes', async () => {
		render(await Home());
		const container = screen.getByTestId('home-container');
		const classes = container.className;
		expect(classes).toContain('min-h-screen');
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-col');
		expect(classes).toContain('items-center');
		expect(classes).toContain('justify-center');
	});

	it('redirects to dashboard when authenticated', async () => {
		vi.mocked(auth).mockResolvedValue(async () => mockUser as unknown as Response);
		await Home();
		expect(vi.mocked(redirect)).toHaveBeenCalledWith('/dashboard');
	  });
});
