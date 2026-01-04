"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
    User as UserIcon,
    Dumbbell,
    Bell,
    Shield,
    Monitor,
    HelpCircle,
    LogOut,
    Sun,
    Moon,
    Smartphone,
    Type,
    Accessibility,
    RotateCcw,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

const sidebarTabs = [
    { id: "account", label: "Account", icon: UserIcon, href: "/settings" },
    { id: "fitness", label: "Fitness Preferences", icon: Dumbbell, href: "/settings/fitness-preferences" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: Shield, href: "/settings/privacy" },
    { id: "display", label: "Display", icon: Monitor, href: "/settings/display" },
];

const themeOptions = [
    { id: "light", label: "Light Mode", icon: Sun },
    { id: "dark", label: "Dark Mode", icon: Moon },
    { id: "system", label: "System Default", icon: Smartphone },
];

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-[var(--color-accent)]" : "bg-zinc-700"
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? "translate-x-6" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

export default function DisplayPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Display settings states
    const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
    const [fontSize, setFontSize] = useState(16);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);
            setLoading(false);
        });
    }, [router, supabase.auth]);

    const handleSignOut = async () => {
        await signOut();
    };

    const resetDefaults = () => {
        setTheme("dark");
        setFontSize(16);
        setReduceMotion(false);
        setHighContrast(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        {/* User Card */}
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{displayName}</div>
                                    <div className="text-xs text-gray-500">Pro Member</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1 mb-6">
                            {sidebarTabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.id === "display"
                                            ? "bg-[var(--color-accent)] text-white"
                                            : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="border-t border-zinc-800 pt-4 space-y-1">
                            <Link
                                href="/support"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-zinc-900 hover:text-white transition-colors"
                            >
                                <HelpCircle size={18} />
                                Help & Support
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-accent)] hover:bg-zinc-900 transition-colors"
                            >
                                <LogOut size={18} />
                                Sign out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Display Setting</h1>
                            <p className="text-gray-400 text-sm">Customize your visual experience, accessibility preferences and dashboard layout.</p>
                        </div>

                        {/* Appearance */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Monitor size={20} className="text-[var(--color-accent)]" />
                                    <h2 className="text-xl font-bold">Appearance</h2>
                                </div>
                                <button
                                    onClick={resetDefaults}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    Reset Defaults
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {themeOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setTheme(option.id as "light" | "dark" | "system")}
                                        className={`p-6 rounded-2xl text-center transition-all ${theme === option.id
                                                ? "bg-[#0c0c0e] border-2 border-[var(--color-accent)]"
                                                : "bg-[#0c0c0e] border border-white/5 hover:border-zinc-700"
                                            }`}
                                    >
                                        <option.icon
                                            size={28}
                                            className={`mx-auto mb-3 ${theme === option.id ? "text-[var(--color-accent)]" : "text-gray-400"
                                                }`}
                                        />
                                        <span className={`text-sm font-medium ${theme === option.id ? "text-[var(--color-accent)]" : "text-gray-400"
                                            }`}>
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Type size={20} className="text-[var(--color-accent)]" />
                                <h2 className="text-xl font-bold">Typography</h2>
                            </div>

                            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-medium flex items-center gap-1">
                                        <span className="text-xs">A</span>
                                        <span>Font Size</span>
                                    </span>
                                    <span className="text-sm text-[var(--color-accent)]">
                                        {fontSize} px {fontSize === 16 && "(Default)"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-xs text-gray-500">A</span>
                                    <input
                                        type="range"
                                        min="12"
                                        max="20"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[var(--color-accent)]"
                                    />
                                    <span className="text-lg text-gray-500">A</span>
                                </div>

                                <div className="border-t border-zinc-800 pt-4">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Preview</span>
                                    <p className="text-gray-400" style={{ fontSize: `${fontSize}px` }}>
                                        Success isn&apos;t always about greatness. It&apos;s about consistency hard work gains successes. Greatness will come.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Accessibility */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Accessibility size={20} className="text-[var(--color-accent)]" />
                                <h2 className="text-xl font-bold">Accessibility</h2>
                            </div>

                            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h3 className="font-bold text-sm">Reduce Motion</h3>
                                        <p className="text-xs text-gray-500">Minimize animations and movement</p>
                                    </div>
                                    <ToggleSwitch enabled={reduceMotion} onChange={setReduceMotion} />
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h3 className="font-bold text-sm">High Contrast</h3>
                                        <p className="text-xs text-gray-500">Increase contrast for better legibility</p>
                                    </div>
                                    <ToggleSwitch enabled={highContrast} onChange={setHighContrast} />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                            <button className="px-6 py-3 border border-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
