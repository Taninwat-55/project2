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
    Eye,
    Globe,
    Share2,
    UserPlus,
    Database,
    Download,
    Trash2,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { getUserSettings, updatePrivacySettings } from "@/app/actions/settings";

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

export default function PrivacyPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error", text: string } | null>(null);
    const router = useRouter();

    // Privacy states
    const [publicProfile, setPublicProfile] = useState(false);
    const [shareActivity, setShareActivity] = useState(false);
    const [allowFriendRequests, setAllowFriendRequests] = useState(false);
    const [anonymousAnalytics, setAnonymousAnalytics] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            // Load settings from database
            const settings = await getUserSettings();
            setPublicProfile(settings.public_profile);
            setShareActivity(settings.share_activity);
            setAllowFriendRequests(settings.allow_friend_requests);
            setAnonymousAnalytics(settings.anonymous_analytics);

            setLoading(false);
        };
        load();
    }, [router, supabase.auth]);

    const handleSignOut = async () => {
        await signOut();
    };

    const handleSave = async () => {
        setSaving(true);
        setMsg(null);

        const result = await updatePrivacySettings({
            public_profile: publicProfile,
            share_activity: shareActivity,
            allow_friend_requests: allowFriendRequests,
            anonymous_analytics: anonymousAnalytics,
        });

        if (result.success) {
            setMsg({ type: "success", text: "Privacy settings saved!" });
        } else {
            setMsg({ type: "error", text: result.error || "Failed to save" });
        }
        setSaving(false);
        setTimeout(() => setMsg(null), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-[var(--muted-foreground)]">Loading...</div>
            </div>
        );
    }

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        {/* User Card */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{displayName}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">Pro Member</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1 mb-6">
                            {sidebarTabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.id === "privacy"
                                        ? "bg-[var(--color-accent)] text-white"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="border-t border-[var(--border)] pt-4 space-y-1">
                            <Link
                                href="/support"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                            >
                                <HelpCircle size={18} />
                                Help & Support
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--muted)] transition-colors"
                            >
                                <LogOut size={18} />
                                Sign out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Title */}
                        <div className="mb-8 pb-6 border-b border-[var(--border)]">
                            <h1 className="text-3xl font-bold mb-2">Privacy & Control</h1>
                            <p className="text-[var(--muted-foreground)] text-sm">Manage your data and visibility settings. You are in control of what you share with the community and with your partners.</p>
                        </div>

                        {/* Visibility & Social */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Eye size={20} className="text-[var(--color-accent)]" />
                                <h2 className="text-xl font-bold">Visibility & Social</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <Globe size={20} className="text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Public Profile</h3>
                                            <p className="text-xs text-[var(--muted-foreground)]">When enabled, other users can find your profile via search and view your bio and stats.</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={publicProfile} onChange={setPublicProfile} />
                                </div>

                                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <Share2 size={20} className="text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Share Activity to Feed</h3>
                                            <p className="text-xs text-[var(--muted-foreground)]">Automatically post your finished workouts to the community feed for your friends to see.</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={shareActivity} onChange={setShareActivity} />
                                </div>

                                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                            <UserPlus size={20} className="text-[var(--color-accent)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Allow Friend Requests</h3>
                                            <p className="text-xs text-[var(--muted-foreground)]">Let other members send you friend requests to connect and complete.</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={allowFriendRequests} onChange={setAllowFriendRequests} />
                                </div>
                            </div>
                        </div>

                        {/* Data & Analytics */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Database size={20} className="text-[var(--color-accent)]" />
                                <h2 className="text-xl font-bold">Data & Analytics</h2>
                            </div>
                            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm">Anonymous Analytics</h3>
                                    <p className="text-xs text-[var(--muted-foreground)]">Contribute anonymous usage data to help us improve Nexus pro features.</p>
                                </div>
                                <ToggleSwitch enabled={anonymousAnalytics} onChange={setAnonymousAnalytics} />
                            </div>
                        </div>

                        {/* Export & Delete */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <button className="bg-[var(--card)] border border-[var(--color-accent)] rounded-2xl p-5 text-left hover:bg-[var(--muted)] transition-colors">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Download size={20} className="text-[var(--color-accent)]" />
                                </div>
                                <h3 className="font-bold text-sm text-[var(--color-accent)] mb-1">Export Data</h3>
                                <p className="text-xs text-[var(--muted-foreground)]">Download a copy of all your workouts, health metrics and account info.</p>
                            </button>

                            <button className="bg-[#0c0c0e] border border-red-500/50 rounded-2xl p-5 text-left hover:bg-red-500/5 transition-colors">
                                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                                    <Trash2 size={20} className="text-red-500" />
                                </div>
                                <h3 className="font-bold text-sm text-red-500 mb-1">Delete Account</h3>
                                <p className="text-xs text-[var(--muted-foreground)]">Permanently delete your account and all associated data. This cannot be undone.</p>
                            </button>
                        </div>

                        {/* Action Buttons */}
                        {msg && (
                            <div className={`p-4 mb-4 rounded-lg border ${msg.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                                {msg.text}
                            </div>
                        )}
                        <div className="flex justify-end gap-4 pt-4 border-t border-[var(--border)]">
                            <button
                                onClick={() => router.refresh()}
                                className="px-6 py-3 border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
