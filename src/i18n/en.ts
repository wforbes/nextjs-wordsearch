export const en = {
	pages: {
		home: {
			title: 'Word Search Game',
			subtitle: 'Ready to start finding words?',
			startButton: 'Start Searching',
		},
		auth: {
			signup: {
				title: 'Sign up',
				nameLabel: 'Full Name',
				emailLabel: 'Email Address',
				passwordLabel: 'Password',
				submitButton: 'Sign Up',
				successMessage: 'Account created successfully',
			},
			login: {
				title: 'Login',
				emailLabel: 'Email Address',
				passwordLabel: 'Password',
				submitButton: 'Login',
			},
			signout: {
				title: 'Signed Out',
				message: 'You have been successfully signed out.',
				returnHome: 'Return to Home Page',
			},
		},
		game: {
			// Add game-related text when needed
		},
	},
	components: {
		navbar: {
			title: 'Your App Name',
			loginButton: 'Login',
			signupButton: 'Sign Up',
			logoutButton: 'Logout',
		},
	},
} as const;

export type Translations = typeof en;

// Helper function to ensure type safety when accessing translations
export const t = (path: keyof Translations) => en[path]; 