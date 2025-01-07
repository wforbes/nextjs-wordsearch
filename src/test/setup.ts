import { cleanup } from '@testing-library/react';
import { beforeAll, beforeEach, vi } from 'vitest';

beforeEach(() => {
	cleanup();
	vi.clearAllMocks();
});

beforeAll(() => {
	vi.mock('next/navigation', async (importOriginal) => {
		const actual = await importOriginal<typeof import('next/navigation')>();
		const { useRouter } = await vi.importActual<typeof import('next-router-mock')>('next-router-mock');

		const usePathname = vi.fn().mockImplementation(() => {
			const router = useRouter();
			return router.pathname;
		});

		const useSearchParams = vi.fn().mockImplementation(() => {
			const router = useRouter();
			return new URLSearchParams(router.query?.toString());
		});

		return {
			...actual,
			useRouter: vi.fn().mockImplementation(useRouter),
			usePathname,
			useSearchParams,
		};
	});



	vi.mock('next/server', () => ({
		NextResponse: {
			json: vi.fn(),
			redirect: vi.fn(),
		},
	}));

	vi.mock('next-auth', () => {
		return {
			default: vi.fn(() => Promise.resolve({ user: null })),
			signIn: vi.fn(),
			signOut: vi.fn(),
			useSession: vi.fn(() => ({
				data: null,
				status: 'unauthenticated',
			})),
		};
	});
	
	vi.mock('@/db/supabase', () => ({
		supabase: {
			from: vi.fn().mockReturnThis(),
			select: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			single: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
		}
	}));
});