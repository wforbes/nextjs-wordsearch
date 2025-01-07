export const en = {
	pages: {
		home: {
			title: 'Word Search Game',
			subtitle: 'Create an account or login to start playing!'
		},
		auth: {
			signup: {
				title: 'Sign up',
				nameLabel: 'Username',
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
				signupSuccess: 'Account created, please Login to continue.',
			},
			signout: {
				title: 'Signed Out',
				message: 'You have been successfully signed out.',
				returnHome: 'Return to Home Page',
			},
		},
		dashboard: {
			title: 'Dashboard',
			startButton: 'New Game',
			savedGames: 'Saved Games',
			loading: 'Loading saved games...',
			noGames: 'No saved games found',
		},
		game: {
			// Add game-related text when needed
			saveButton: 'Save Game',
			saveSuccess: 'Game saved successfully',
			saveLoading: 'Saving...',
		},
	},
	components: {
		navbar: {
			title: 'Word Search Game',
			loginButton: 'Login',
			signupButton: 'Sign Up',
			logoutButton: 'Logout',
		},
	},
} as const;

export type Translations = typeof en;

// Helper function to ensure type safety when accessing translations
export const t = (path: keyof Translations) => en[path]; 