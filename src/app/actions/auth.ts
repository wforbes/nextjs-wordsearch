'use server';

import { en } from '@/i18n/en';

interface SignUpData {
	name: string;
	email: string;
	password: string;
}

export async function signUp(data: SignUpData) {
	try {
		console.log('Sign up data:', data);
		// TODO: Add actual user creation logic
		// For now, just simulate a delay and return success
		await new Promise(resolve => setTimeout(resolve, 1000));

		return {
			success: true,
			message: en.pages.auth.signup.successMessage
		};
	} catch (error) {
		console.error('Sign up error:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to create account'
		};
	}
}