'use server';

import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { signUpValidation, type SignUpInput } from '@/app/signup/_lib/validation'
import { generateUUID } from '@/lib/utils'
import { signIn } from '@/auth'

// Consolidate error types and messages
const AUTH_ERRORS = {
	USER_NOT_FOUND: {
		type: 'user_not_found' as const,
		message: 'No account found with this email'
	},
	INVALID_CREDENTIALS: {
		type: 'invalid_credentials' as const,
		message: 'Invalid password'
	},
	DATABASE_ERROR: {
		type: 'database_error' as const,
		message: 'Unable to verify credentials'
	}
} as const

type AuthError = typeof AUTH_ERRORS[keyof typeof AUTH_ERRORS]

export async function signUp(data: SignUpInput) {
	// Validate input
	const result = signUpValidation.safeParse(data)
	if (!result.success) {
		return {
				success: false,
				message: 'Invalid input data'
			}
	}

	try {
		// Check if user already exists
		const { data: existingUser } = await supabase
			.from('users')
			.select('id')
			.eq('email', data.email.toLowerCase())
			.single()

		if (existingUser) {
			return {
				success: false,
				message: 'A user with this email already exists'
			}
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(data.password, 10)

		// Generate unique ID
		const userId = generateUUID()
		const now = new Date().toISOString()

		// Create user
		const { error: createError } = await supabase
			.from('users')
			.insert({
				id: userId,
				name: data.name,
				email: data.email.toLowerCase(),
				password: hashedPassword,
				emailVerified: null,
				image: null,
				created_at: now,
				updated_at: now
			})

		if (createError) {
			console.error('Error creating user:', createError)
			return {
				success: false,
				message: 'Failed to create user account'
			}
		}

		return {
			success: true,
			message: 'Account created successfully'
		}
	} catch (error) {
		console.error('Sign up error:', error)
		return {
			success: false,
			message: 'An unexpected error occurred'
		}
	}
}

type VerifyResult = {
	user: {
		id: string
		email: string
		name: string
		emailVerified: Date | null
		image: string | null
	} | null
	error: AuthError | null
}

export async function verifyCredentials(email: string, password: string): Promise<VerifyResult> {
	// Get user from database
	const { data: user, error } = await supabase
		.from('users')
		.select('*')
		.eq('email', email.toLowerCase())
		.single()

	if (error?.code === 'PGRST116') {  // Supabase code for no rows returned
		return {
			user: null,
			error: AUTH_ERRORS.USER_NOT_FOUND
		}
	}

	if (error) {
		console.error('Database error:', error)
		return {
			user: null,
			error: AUTH_ERRORS.DATABASE_ERROR
		}
	}

	if (!user) {
		return {
			user: null,
			error: AUTH_ERRORS.USER_NOT_FOUND
		}
	}

	// Verify password
	const passwordValid = await bcrypt.compare(password, user.password)
	if (!passwordValid) {
		return {
			user: null,
			error: AUTH_ERRORS.INVALID_CREDENTIALS
		}
	}

	// Return user without password
	return {
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			emailVerified: user.emailVerified,
			image: user.image
		},
		error: null
	}
}

export async function signInAction(email: string, password: string) {
	try {
		const result = await verifyCredentials(email, password)

		if (result.error) {
			// Return user-friendly error messages based on error type
			switch (result.error.type) {
				case 'user_not_found':
					return { error: 'No account found with this email' }
				case 'invalid_credentials':
					return { error: 'Invalid password' }
				case 'database_error':
				default:
					console.error('Auth error:', result.error)
					return { error: 'An error occurred while signing in' }
			}
		}

		const signInResult = await signIn('credentials', {
			email,
			password,
			redirect: false,
		})

		return signInResult
	} catch (error) {
		console.error('Sign in error:', error)
		return {
			error: 'An unexpected error occurred'
		}
	}
}

export async function signOutAction() {
	const { signOut } = await import('@/auth')
	await signOut({ redirectTo: '/signout' })
	return { success: true }
}