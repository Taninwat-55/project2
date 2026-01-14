import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    } = await supabase.auth.getUser()

    // Check if profile is completed (only if user exists)
    let profileCompleted = false
    if (user) {
        // First, check user metadata for cached profile completion status
        const cachedStatus = user.user_metadata?.profile_completed
        
        if (cachedStatus !== undefined) {
            // Use cached value from user metadata
            profileCompleted = cachedStatus
        } else {
            // Fallback: query database only if not in metadata
            const { data: profile } = await supabase
                .from('profiles')
                .select('profile_completed')
                .eq('id', user.id)
                .single()

            profileCompleted = profile?.profile_completed ?? false
        }
    }

    return { user, profileCompleted, supabaseResponse }
}
