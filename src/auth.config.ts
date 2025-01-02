import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyCredentials } from "@/app/actions/auth"

export const authConfig = {
	pages: {
		signIn: '/login',
		signOut: '/signout',
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

			if (isOnDashboard) {
				if (isLoggedIn) return true
				return false
			}
			return true
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.email = user.email
				token.name = user.name
			}
			return token
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string
			}
			return session
		}
	},
	providers: [
		Credentials({
			async authorize(credentials: { email: string; password: string } | undefined) {
				try {
					if (!credentials?.email || !credentials?.password) {
						return null
					}

					const result = await verifyCredentials(credentials.email, credentials.password)

					if (result.error) {
						return null
					}

					return result.user
				} catch (error) {
					console.error('Auth error:', error)
					return null
				}
			}
		})
	],
} satisfies NextAuthConfig 