'use server';

import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { signUpValidation, type SignUpInput } from '@/app/signup/_lib/validation'
import crypto from 'crypto'

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
		const userId = crypto.randomUUID()
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