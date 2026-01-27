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
  Users,
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

  // --- NOTIFICATION PERSISTENCE LOGIC ---
  const [notificationsOn, setNotificationsOn] = useState<boolean>(true);
  const [isRinging, setIsRinging] = useState(false);

  // 1. Load preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('notifications_pref');
    if (savedPreference !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotificationsOn(savedPreference === 'true');
    }
  }, []);

  const handleBellClick = () => {
    setIsRinging(true);
    
    // Toggle state and save to localStorage
    setNotificationsOn((prev) => {
      const nextState = !prev;
      localStorage.setItem('notifications_pref', String(nextState));
      return nextState;
    });

    // Reset animation state after 500ms
    setTimeout(() => setIsRinging(false), 500);
  };
  // --------------------------------------

  const baseNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const dashboardLink = { name: 'Dashboard', href: '/dashboard' };

  const navLinks = user 
    ? [...baseNavLinks.slice(0, 2), dashboardLink, ...baseNavLinks.slice(2)]
    : baseNavLinks;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

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

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header
      className={`${
        fixed ? 'sticky top-0' : 'relative'
      } w-full z-50 transition-all duration-300`}
    >
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

        {/* Navigation */}
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
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.4,
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
              <button
                onClick={handleBellClick}
                className="relative p-2 transition-colors cursor-pointer"
                aria-label="Toggle Notifications"
              >
                <motion.div
                  animate={
                    isRinging && notificationsOn
                      ? {
                          rotate: [0, -20, 20, -15, 15, -5, 5, 0],
                          scale: [1, 1.2, 1],
                        }
                      : {
                          rotate: 0,
                          scale: 1,
                        }
                  }
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <Bell
                    size={22}
                    className={`transition-colors duration-300 ${
                      notificationsOn ? 'text-orange-500' : 'text-white'
                    }`}
                    fill={notificationsOn ? 'currentColor' : 'none'}
                  />
                </motion.div>

                {notificationsOn && (
                  <motion.div
                    layoutId="glow"
                    className="absolute inset-0 bg-orange-500/10 blur-lg rounded-full"
                  />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full border-2 border-zinc-800 hover:border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white transition-colors bg-zinc-900 cursor-pointer overflow-hidden"
                >
                  <UserIcon size={20} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                        y: -20,
                        transformOrigin: 'top right',
                      }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        y: -10,
                        transition: { duration: 0.15, ease: 'easeOut' },
                      }}
                      transition={{
                        type: 'spring',
                        bounce: 0.55,
                        duration: 0.5,
                      }}
                      className="absolute right-0 mt-3 w-52 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                    >
                      <div className="px-3 py-2 mb-1 border-b border-white/5">
                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                          Account
                        </p>
                        <p className="text-sm font-bold text-white truncate">
                          {displayName}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        {[
                          { name: 'Dashboard', icon: <LayoutDashboard size={16} />, href: '/dashboard' },
                          { name: 'Workouts', icon: <Dumbbell size={16} />, href: '/workouts' },
                          { name: 'Nutrition', icon: <UtensilsCrossed size={16} />, href: '/nutrition' },
                          { name: 'Progress', icon: <TrendingUp size={16} />, href: '/progress' },
                          { name: 'Community', icon: <Users size={16} />, href: '/community' },
                          { name: 'Archive', icon: <Archive size={16} />, href: '/archive' },
                          { name: 'History', icon: <History size={16} />, href: '/history' },
                        ].map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <motion.div
                              whileTap={{ scale: 0.96 }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <span className="group-hover:text-orange-500 transition-colors">
                                {item.icon}
                              </span>
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
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
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <motion.div
                              whileTap={{ scale: 0.96 }}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <span className="group-hover:text-orange-500 transition-colors">
                                {item.icon}
                              </span>
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
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
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-white hover:text-zinc-400 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:opacity-80 transition-colors"
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