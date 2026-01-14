import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { user, profileCompleted, supabaseResponse } = await updateSession(request)

    const pathname = request.nextUrl.pathname

    // Allow unauthenticated access to login, signup, and onboarding pages
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
    const isOnboardingPage = pathname.startsWith('/onboarding')

    // If no user and trying to access protected routes, redirect to login
    // Preserve the original URL so user can be redirected back after login
    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirectTo', request.nextUrl.pathname)
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

// Middleware configuration
// Protected routes that require authentication:
// - /dashboard: User's personal dashboard and analytics
// - /nutrition: Nutrition tracking and meal planning
// - /workouts: Workout logging and templates
// - /settings: User preferences and account settings
// - /history: Activity and workout history
// - /support: User support and help center (may contain personal data)
// - /archive: Archived user data
// Note: /about and /contact are intentionally NOT protected as they are public informational pages
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/nutrition/:path*',
        '/workouts/:path*',
        '/settings/:path*',
        '/history/:path*',
        '/support/:path*',
        '/archive/:path*',
        '/onboarding/:path*',
        '/login/:path*',
        '/signup/:path*',
    ],
}
