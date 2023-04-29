import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // console.log(request.nextUrl.pathname)
    if (request.nextUrl.pathname.startsWith('/login')) {
        if (request.cookies.get('userData')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

    }

    if (request.nextUrl.pathname.startsWith('/signup')) {
        if (request.cookies.get('userData')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

    }

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!request.cookies.get('userData')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

    }
}