import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { user, profileCompleted, supabaseResponse } = await updateSession(request)

    // If no user and trying to access protected routes, redirect to login
    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If user exists but profile is not completed, redirect to onboarding
    // Skip this check if already on the onboarding page
    if (!profileCompleted && !request.nextUrl.pathname.startsWith('/onboarding')) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/nutrition/:path*',
        '/workouts/:path*',
        '/settings/:path*',
        '/history/:path*',
        '/support/:path*',
        '/about/:path*',
        '/contact/:path*',
        '/archive/:path*',
        '/onboarding/:path*',
    ],
}
