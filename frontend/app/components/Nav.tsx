"use client";

import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Nav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // 1. Check active user on load
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // 2. Set up a listener for real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        router.refresh(); // Refreshes Server Components (like Dashboard)
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.refresh();
        router.push("/"); // Redirect to home on logout
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener above will handle the redirect and state update
  };

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center bg-white dark:bg-black">
      <Link href="/" className="font-bold text-xl tracking-tight">
        FitnessApp
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-500 hidden sm:inline">
              {user.email}
            </span>
            <Link href="/dashboard" className="hover:underline font-medium">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              Logga ut
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
          >
            Logga in
          </Link>
        )}
      </div>
    </nav>
  );
}
