'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import {
  Bell,
  User as UserIcon,
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  Archive,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { signOut } from '@/app/(auth)/actions';

interface SiteHeaderProps {
  fixed?: boolean;
}

export default function SiteHeader({ fixed = false }: SiteHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create Supabase browser client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut();
  };

  // Get display name from user metadata or email
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header
      className={`
                w-full z-50 transition-all duration-300
                ${
                  fixed
                    ? 'fixed top-0 left-0 right-0 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]'
                    : 'relative bg-transparent'
                }
            `}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors">
            N
          </div>
          <span className="font-bold text-xl tracking-wide text-[var(--foreground)]">
            Nexus
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-[var(--muted-foreground)]">
          <Link
            href="/"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right side - Auth dependent */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell */}
              <button className="relative p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                <Bell size={22} />
                {/* Notification dot - uncomment when needed */}
                {/* <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-accent)] rounded-full"></span> */}
              </button>

              {/* Profile Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full border-2 border-[var(--border)] hover:border-[var(--muted-foreground)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors bg-[var(--card)]"
                >
                  <UserIcon size={20} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Username */}
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                        {displayName}
                      </p>
                    </div>

                    {/* Main Links */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link
                        href="/workouts"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <Dumbbell size={18} />
                        Workouts
                      </Link>
                      <Link
                        href="/nutrition"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <UtensilsCrossed size={18} />
                        Nutrition
                      </Link>
                      <Link
                        href="/archive"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <Archive size={18} />
                        Archive
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[var(--border)]"></div>

                    {/* Secondary Links */}
                    <div className="py-2">
                      <Link
                        href="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <Settings size={18} />
                        Setting
                      </Link>
                      <Link
                        href="/support"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <HelpCircle size={18} />
                        Support
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <LogOut size={18} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--muted-foreground)] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-full text-sm font-bold hover:opacity-80 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
