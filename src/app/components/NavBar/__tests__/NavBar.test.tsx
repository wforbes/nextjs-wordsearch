import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavBar from '../NavBar';
import { mockUser } from '@/test/mockData/auth';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

vi.mock('@/auth', () => ({
	auth: vi.fn().mockImplementation(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		() => async (req: NextRequest) => {
			return mockUser;
		}
	)
}));

vi.mock('@/app/actions/auth', () => ({
	signOutAction: vi.fn().mockImplementation(() => {
		mockRouter.push('/signout');
		return { success: true }
	})
}));

vi.mock('@/db/supabase', () => ({
	supabase: {
		from: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		single: vi.fn().mockResolvedValue({ data: null, error: null })
	}
}));

describe('NavBar', () => {
	beforeEach(() => {
		mockRouter.push('/'); // Reset router state before each test
	});

	it('renders the navbar', async () => {
		render(await NavBar());
		expect(screen.getByTestId('navbar')).toBeDefined();
	});

	it('renders the navbar with a signup button when not authenticated', async () => {
		vi.mocked(auth).mockResolvedValue(null);
		render(await NavBar());
		expect(screen.getByText('Sign Up')).toBeDefined();
	});

	it('navigates to signup page when Sign Up button is clicked', async () => {
		vi.mocked(auth).mockResolvedValue(null);
		render(await NavBar(), { wrapper: MemoryRouterProvider });
		
		const signupButton = screen.getByRole('link', { name: /sign up/i });
		expect(signupButton).toBeDefined();
		expect(signupButton.getAttribute('href')).toBe('/signup');
		fireEvent.click(signupButton);
		await waitFor(() => {
			expect(mockRouter).toMatchObject({ pathname: '/signup' });
		});
	});

	it('renders the navbar with a login button when not authenticated', async () => {
		vi.mocked(auth).mockResolvedValue(null);
		render(await NavBar());
		expect(screen.getByText('Login')).toBeDefined();
	});

	it('navigates to login page when Login button is clicked', async () => {
		vi.mocked(auth).mockResolvedValue(null);
		render(await NavBar(), { wrapper: MemoryRouterProvider });
		
		const loginButton = screen.getByRole('link', { name: /login/i });
		expect(loginButton).toBeDefined();
		expect(loginButton.getAttribute('href')).toBe('/login');
		fireEvent.click(loginButton);
		await waitFor(() => {
			expect(mockRouter.pathname).toBe('/login');
		});
	});

	it('renders the navbar with a logout button when authenticated', async () => {
		vi.mocked(auth).mockResolvedValue(async () => mockUser as unknown as Response);
		render(await NavBar());
		expect(screen.getByText('Logout')).toBeDefined();
	});

	it('calls signOut when Logout button is clicked', async () => {
		vi.mocked(auth).mockResolvedValue(async () => mockUser as unknown as Response);
		render(await NavBar());
		
		const logoutButton = screen.getByText('Logout');
		expect(logoutButton).toBeDefined();
		fireEvent.click(logoutButton);
		await waitFor(() => {
			expect(mockRouter).toMatchObject({ pathname: '/signout' });
		});
	});
});
