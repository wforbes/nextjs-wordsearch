import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
	const session = await auth()
	const path = request.nextUrl.pathname

	// Allow access to signout page regardless of session
	if (path === '/signout') {
		return NextResponse.next()
	}

	// Protected routes - if no session, redirect to login
	if (
		(path.startsWith('/dashboard') || path.startsWith('/game') )
		&& !session
	) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 