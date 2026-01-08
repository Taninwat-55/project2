'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Navbar Links Array for animation mapping
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

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
    <header className="sticky top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-lg group-hover:bg-orange-500 group-hover:text-black transition-colors">
            N
          </div>
          <span className="font-bold text-xl tracking-wide text-white">
            Nexus
          </span>
        </Link>

        {/* The Sticky Pill Navbar with Bubbly Animation */}
        <nav className="hidden md:flex items-center gap-2 px-3 py-2 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl relative">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-6 py-2 text-white font-bold transition-colors z-10"
            >
              <AnimatePresence>
                {hoveredLink === link.name && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.4
                    }}
                  />
                )}
              </AnimatePresence>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side - Auth dependent */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell */}
              <button className="relative p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
                <Bell size={22} />
              </button>

              {/* Profile Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full border-2 border-[var(--border)] hover:border-[var(--muted-foreground)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors bg-[var(--card)] cursor-pointer"
                >
                  <UserIcon size={20} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                        {displayName}
                      </p>
                    </div>

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

                    <div className="border-t border-[var(--border)]"></div>

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