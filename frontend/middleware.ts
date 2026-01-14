import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { user, profileCompleted, supabaseResponse } = await updateSession(request)

    const pathname = request.nextUrl.pathname

    // Allow unauthenticated access to login, signup, and onboarding pages
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
    const isOnboardingPage = pathname.startsWith('/onboarding')

    // If no user and trying to access protected routes, redirect to login
    // But allow access to onboarding, login, and signup
    if (!user && !isAuthPage && !isOnboardingPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If user exists but profile is not completed, redirect to onboarding
    // Skip this check if already on the onboarding, login, or signup page
    if (user && !profileCompleted && !isOnboardingPage && !isAuthPage) {
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
        '/login/:path*',
        '/signup/:path*',
    ],
}
