"use client";

import Link from "next/link";

interface SiteHeaderProps {
    fixed?: boolean;
}

export default function SiteHeader({ fixed = false }: SiteHeaderProps) {
    return (
        <header
            className={`
                w-full z-50 transition-all duration-300
                ${fixed
                    ? "fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/5"
                    : "relative bg-transparent"
                }
            `}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors">
                        N
                    </div>
                    <span className="font-bold text-xl tracking-wide text-white">Nexus</span>
                </Link>

                <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/#meal-plans" className="hover:text-white transition-colors">Meal-Plans</Link>
                    <Link href="/#data" className="hover:text-white transition-colors">Data</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-bold text-white hover:text-gray-300 transition-colors">Log In</Link>
                    <Link href="/signup" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Sign Up</Link>
                </div>
            </div>
        </header>
    );
}
