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
    BellOff,
    Dumbbell as DumbbellIcon,
    Trophy,
    BarChart3,
    UserPlus,
    Flag,
    MessageSquare,
    Heart,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

const sidebarTabs = [
    { id: "account", label: "Account", icon: UserIcon, href: "/settings" },
    { id: "fitness", label: "Fitness Preferences", icon: Dumbbell, href: "/settings/fitness-preferences" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: Shield, href: "/settings/privacy" },
    { id: "display", label: "Display", icon: Monitor, href: "/settings/display" },
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

export default function NotificationsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Notification states
    const [pauseAll, setPauseAll] = useState(false);
    const [dailyReminders, setDailyReminders] = useState(false);
    const [goalCompletions, setGoalCompletions] = useState(false);
    const [weeklyReport, setWeeklyReport] = useState(false);
    const [friendRequests, setFriendRequests] = useState(true);
    const [challengeInvites, setChallengeInvites] = useState(true);
    const [comments, setComments] = useState(true);
    const [kudos, setKudos] = useState(true);

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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.id === "notifications"
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
                        <div className="mb-8 pb-6 border-b border-zinc-800">
                            <h1 className="text-3xl font-bold mb-2">Notification Setting</h1>
                            <p className="text-gray-400 text-sm">Manage how and when you receive updates about your fitness journey.</p>
                        </div>

                        {/* Pause All Notifications */}
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                    <BellOff size={20} className="text-[var(--color-accent)]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Pause all notifications</h3>
                                    <p className="text-xs text-gray-500">Temporary silence all push and email notifications.</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={pauseAll} onChange={setPauseAll} />
                        </div>

                        {/* Workout & Activity */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Workout & Activity</h2>
                            <div className="space-y-3">
                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <DumbbellIcon size={20} className="text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Daily Workout Reminders</h3>
                                            <p className="text-xs text-gray-500">Receive an email notification to start your daily routine.</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={dailyReminders} onChange={setDailyReminders} />
                                </div>

                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <Trophy size={20} className="text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Goal Completions</h3>
                                            <p className="text-xs text-gray-500">Get celebrated when you hit your milestones.</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={goalCompletions} onChange={setGoalCompletions} />
                                </div>

                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <BarChart3 size={20} className="text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Weekly Progress Report</h3>
                                            <p className="text-xs text-gray-500">Summary of your stats delivered via email.</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={weeklyReport} onChange={setWeeklyReport} />
                                </div>
                            </div>
                        </div>

                        {/* Community */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Community</h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <UserPlus size={18} className="text-[var(--color-accent)]" />
                                        </div>
                                        <span className="font-medium text-sm">Friend Requests</span>
                                    </div>
                                    <ToggleSwitch enabled={friendRequests} onChange={setFriendRequests} />
                                </div>

                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <Flag size={18} className="text-[var(--color-accent)]" />
                                        </div>
                                        <span className="font-medium text-sm">Challenge Invites</span>
                                    </div>
                                    <ToggleSwitch enabled={challengeInvites} onChange={setChallengeInvites} />
                                </div>

                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <MessageSquare size={18} className="text-[var(--color-accent)]" />
                                        </div>
                                        <span className="font-medium text-sm">Comments & Mentions</span>
                                    </div>
                                    <ToggleSwitch enabled={comments} onChange={setComments} />
                                </div>

                                <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <Heart size={18} className="text-[var(--color-accent)]" />
                                        </div>
                                        <span className="font-medium text-sm">Kudos from friends</span>
                                    </div>
                                    <ToggleSwitch enabled={kudos} onChange={setKudos} />
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
