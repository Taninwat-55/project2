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
    MapPin,
    CalendarDays,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

const sidebarTabs = [
    { id: "account", label: "Account", icon: UserIcon, href: "/settings" },
    { id: "fitness", label: "Fitness Preferences", icon: Dumbbell, href: "/settings/fitness-preferences" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: Shield, href: "/settings/privacy" },
    { id: "display", label: "Display", icon: Monitor, href: "/settings/display" },
];

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "••••••••••••",
        phone: "+1 (555) 234-12343",
        location: "San Francisco, CA",
        language: "English (US)",
        timezone: "(GMT-8:00) Pacific Time (USA & Canada)",
    });

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
            setFormData((prev) => ({
                ...prev,
                firstName: user.user_metadata?.full_name?.split(" ")[0] || "Alex",
                lastName: user.user_metadata?.full_name?.split(" ")[1] || "Johnson",
                email: user.email || "alex.johnson@example.com",
            }));
            setLoading(false);
        });
    }, [router, supabase.auth]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSignOut = async () => {
        await signOut();
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.id === "account"
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
                            <h1 className="text-3xl font-bold mb-2">Account Setting</h1>
                            <p className="text-gray-400 text-sm">Manage your personal details and subscriptions</p>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-2xl">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white text-xs">
                                        📷
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays size={14} />
                                            Member since 2021
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {formData.location}
                                        </span>
                                    </div>
                                </div>
                                <span className="px-3 py-1.5 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-full text-xs font-medium">
                                    Pro Plan Active
                                </span>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Personal Information</h3>
                                <button className="text-sm text-[var(--color-accent)] hover:underline">Edit</button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Regional Settings */}
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-bold mb-6">Regional Setting</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option>English (US)</option>
                                        <option>English (UK)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Time Zone</label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option>(GMT-8:00) Pacific Time (USA & Canada)</option>
                                        <option>(GMT-5:00) Eastern Time (USA & Canada)</option>
                                        <option>(GMT+0:00) UTC</option>
                                        <option>(GMT+1:00) Central European Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mb-8">
                            <button className="px-6 py-3 border border-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                                Save Changes
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="bg-[#0c0c0e] border border-red-900/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-red-500 mb-1">Delete Account</h3>
                                    <p className="text-sm text-gray-500">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button className="px-5 py-2.5 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-500/10 transition-colors">
                                    Delete your account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
