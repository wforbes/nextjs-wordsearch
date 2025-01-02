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
            },
            login: {
                title: 'Login',
                emailLabel: 'Email Address',
                passwordLabel: 'Password',
                submitButton: 'Login',
            },
        },
        game: {
            // Add game-related text when needed
        },
    },
    components: {
        navbar: {
            signupButton: 'Sign Up',
            loginButton: 'Login',
        },
    },
} as const;

export type Translations = typeof en;

// Helper function to ensure type safety when accessing translations
export const t = (path: keyof Translations) => en[path]; 