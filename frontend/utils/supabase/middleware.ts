import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Validate required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        const missing = []
        if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
        if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        console.error(`Missing required Supabase environment variables: ${missing.join(', ')}`)
        throw new Error(`Supabase configuration is missing: ${missing.join(', ')}. Please check your environment variables.`)
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Do not write any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    // Check if profile is completed (only if user exists)
    let profileCompleted = false
    if (user) {
        // First, check user metadata for cached profile completion status
        const cachedStatus = user.user_metadata?.profile_completed

        if (typeof cachedStatus === 'boolean') {
            // Use cached value from user metadata
            profileCompleted = cachedStatus
            if (process.env.NODE_ENV !== 'production') {
                console.log('[Middleware] Using cached profile_completed from metadata:', cachedStatus)
            }
        } else {
            // Fallback: query database only if not in metadata
            if (process.env.NODE_ENV !== 'production') {
                console.log('[Middleware] Profile completion status not in metadata, querying database for user:', user.id)
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('profile_completed')
                .eq('id', user.id)
                .single()

            if (profileError) {
                console.error('[Middleware] Error fetching profile:', profileError.message)
            }

            if (process.env.NODE_ENV !== 'production') {
                console.log('[Middleware] Database profile result:', profile)
            }
            profileCompleted = profile?.profile_completed ?? false
            if (process.env.NODE_ENV !== 'production') {
                console.log('[Middleware] Final profileCompleted value:', profileCompleted)
            }
        }
    }

    // Log auth errors for debugging, but don't throw to allow graceful handling
    if (error) {
        console.error('Error retrieving user from Supabase:', error.message)
    }

    return { user, profileCompleted, supabaseResponse }
}
