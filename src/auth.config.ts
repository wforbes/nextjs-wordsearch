import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                // We'll implement this later
                return null
            }
        })
    ],
} satisfies NextAuthConfig 