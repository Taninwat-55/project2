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
  History,
  TrendingUp,
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
    <header className={`${fixed ? 'sticky top-0' : 'relative'} w-full z-50 transition-all duration-300`}>
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

  // The Sticky Pill Navbar with Bubbly Animation
        <nav className="hidden md:flex items-center gap-2 px-3 py-2 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl relative">
          {(user ? [{ name: 'Dashboard', href: '/dashboard' }, ...navLinks] : navLinks).map((link) => (
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
                  className="w-10 h-10 rounded-full border-2 border-zinc-800 hover:border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white transition-colors bg-zinc-900 cursor-pointer overflow-hidden"
                >
                  <UserIcon size={20} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      // 1. Start much smaller and higher up, growing from the top right
                      initial={{ opacity: 0, scale: 0.85, y: -20, transformOrigin: 'top right' }}
                      // 2. Animate to full size and correct position
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      // 3. Exit quickly by shrinking
                      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15, ease: "easeOut" } }}
                      // 4. The Bubbly Spring Physics configuration
                      transition={{
                        type: "spring",
                        bounce: 0.55, // Adjust between 0.4 (subtle) and 0.7 (very bouncy). 0.55 is very "Apple-like".
                        duration: 0.5
                      }}
                      className="absolute right-0 mt-3 w-52 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                    >
                      {/* User Header - Compact Pill */}
                      <div className="px-3 py-2 mb-1 border-b border-white/5">
                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Account</p>
                        <p className="text-sm font-bold text-white truncate">{displayName}</p>
                      </div>

                      <div className="space-y-0.5">
                        {[
                          { name: 'Dashboard', icon: <LayoutDashboard size={16} />, href: '/dashboard' },
                          { name: 'Workouts', icon: <Dumbbell size={16} />, href: '/workouts' },
                          { name: 'Nutrition', icon: <UtensilsCrossed size={16} />, href: '/nutrition' },
                          { name: 'Progress', icon: <TrendingUp size={16} />, href: '/progress' },
                          { name: 'Archive', icon: <Archive size={16} />, href: '/archive' },
                          { name: 'History', icon: <History size={16} />, href: '/history' },
                        ].map((item) => (
                          <Link key={item.name} href={item.href} onClick={() => setIsDropdownOpen(false)}>
                            <motion.div
                              whileTap={{ scale: 0.96 }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <span className="group-hover:text-orange-500 transition-colors">{item.icon}</span>
                              <span className="text-sm font-medium">{item.name}</span>
                            </motion.div>
                          </Link>
                        ))}
                      </div>

                      <div className="my-1.5 border-t border-white/5" />

                      <div className="space-y-0.5">
                        {[
                          { name: 'Settings', icon: <Settings size={16} />, href: '/settings' },
                          { name: 'Support', icon: <HelpCircle size={16} />, href: '/support' },
                        ].map((item) => (
                          <Link key={item.name} href={item.href} onClick={() => setIsDropdownOpen(false)}>
                            <motion.div
                              whileTap={{ scale: 0.96 }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <span className="group-hover:text-orange-500 transition-colors">{item.icon}</span>
                              <span className="text-sm font-medium">{item.name}</span>
                            </motion.div>
                          </Link>
                        ))}

                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group cursor-pointer"
                        >
                          <LogOut size={16} />
                          <span className="text-sm font-medium">Log out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>) : (
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