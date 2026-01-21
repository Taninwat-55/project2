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
    Sofa,
    PersonStanding,
    Zap,
    Target,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { getUserSettings, updateFitnessPreferences } from "@/app/actions/settings";

const sidebarTabs = [
    { id: "account", label: "Account", icon: UserIcon, href: "/settings" },
    { id: "fitness", label: "Fitness Preferences", icon: Dumbbell, href: "/settings/fitness-preferences" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: Shield, href: "/settings/privacy" },
    { id: "display", label: "Display", icon: Monitor, href: "/settings/display" },
];

const activityLevels = [
    { id: "sedentary", label: "Sedentary", description: "Little to no exercise, desk job.", icon: Sofa },
    { id: "lightly_active", label: "Lightly active", description: "Light exercise 1-3 days/week.", icon: PersonStanding },
    { id: "very_active", label: "Very active", description: "Hard exercise 6-7 days/week.", icon: Zap },
];

export default function FitnessPreferencesPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error", text: string } | null>(null);
    const router = useRouter();

    // Preferences state
    const [distanceUnit, setDistanceUnit] = useState<"kilometers" | "miles">("kilometers");
    const [weightUnit, setWeightUnit] = useState<"kilograms" | "pounds">("kilograms");
    const [energyUnit, setEnergyUnit] = useState<"calories" | "kilojoules">("calories");
    const [primaryFocus, setPrimaryFocus] = useState("general_fitness");
    const [weeklyGoal, setWeeklyGoal] = useState(4);
    const [weeklyWeightGoal, setWeeklyWeightGoal] = useState(0);
    const [activityLevel, setActivityLevel] = useState("lightly_active");

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
            setDistanceUnit(settings.distance_unit);
            setWeightUnit(settings.weight_unit);
            setEnergyUnit(settings.energy_unit);
            setPrimaryFocus(settings.primary_focus);
            setWeeklyGoal(settings.weekly_goal);
            setWeeklyWeightGoal(settings.weekly_weight_goal_kg ?? 0);
            setActivityLevel(settings.activity_level);

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

        const result = await updateFitnessPreferences({
            distance_unit: distanceUnit,
            weight_unit: weightUnit,
            energy_unit: energyUnit,
            primary_focus: primaryFocus,
            weekly_goal: weeklyGoal,
            weekly_weight_goal_kg: weeklyWeightGoal,
            strength_goal_days: 0, // Legacy, no longer used
            cardio_goal_minutes: 0, // Legacy, no longer used
            activity_level: activityLevel,
        });

        if (result.success) {
            setMsg({ type: "success", text: "Preferences saved successfully!" });
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.id === "fitness"
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
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Fitness Preferences</h1>
                            <p className="text-[var(--muted-foreground)] text-sm">Customize your tracking units, goals, and daily habits to fit your lifestyle.</p>
                        </div>

                        {/* Measurement Units */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Measurement Units</h2>
                            <p className="text-[var(--muted-foreground)] text-sm mb-6">Choose how you want to measure your progress.</p>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Distance */}
                                <div>
                                    <label className="text-sm text-[var(--muted-foreground)] mb-3 block">Distance</label>
                                    <div className="flex bg-[var(--muted)] rounded-xl p-1">
                                        <button
                                            onClick={() => setDistanceUnit("kilometers")}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${distanceUnit === "kilometers"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Kilometers
                                        </button>
                                        <button
                                            onClick={() => setDistanceUnit("miles")}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${distanceUnit === "miles"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Miles
                                        </button>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="text-sm text-[var(--muted-foreground)] mb-3 block">Weight</label>
                                    <div className="flex bg-[var(--muted)] rounded-xl p-1">
                                        <button
                                            onClick={() => setWeightUnit("kilograms")}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${weightUnit === "kilograms"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Kilograms
                                        </button>
                                        <button
                                            onClick={() => setWeightUnit("pounds")}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${weightUnit === "pounds"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Pounds
                                        </button>
                                    </div>
                                </div>

                                {/* Energy */}
                                <div>
                                    <label className="text-sm text-[var(--muted-foreground)] mb-3 block">Energy</label>
                                    <div className="flex bg-[var(--muted)] rounded-xl p-1">
                                        <button
                                            onClick={() => setEnergyUnit("calories")}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${energyUnit === "calories"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Calories
                                        </button>
                                        <button
                                            onClick={() => setEnergyUnit("kilojoules")}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${energyUnit === "kilojoules"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Kilojoules
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Goals */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-[var(--color-accent)]/20 rounded-lg flex items-center justify-center">
                                    <Target size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <h2 className="text-xl font-bold">Personal Goals</h2>
                            </div>
                            <p className="text-[var(--muted-foreground)] text-sm mb-6">Set your target to help us personalize your plan.</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Primary Focus - Simplified to 3 Weight Options */}
                                <div>
                                    <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Weight Goal</label>
                                    <div className="flex bg-[var(--muted)] rounded-xl p-1">
                                        <button
                                            onClick={() => setPrimaryFocus("weight_loss")}
                                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${primaryFocus === "weight_loss"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Lose Weight
                                        </button>
                                        <button
                                            onClick={() => setPrimaryFocus("maintain")}
                                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${primaryFocus === "maintain"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Maintain
                                        </button>
                                        <button
                                            onClick={() => setPrimaryFocus("weight_gain")}
                                            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${primaryFocus === "weight_gain"
                                                ? "bg-[var(--color-accent)] text-white"
                                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                                }`}
                                        >
                                            Gain Weight
                                        </button>
                                    </div>
                                </div>

                                {/* Weekly Weight Goal Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-[var(--muted-foreground)]">Weekly Weight Target</label>
                                        <span className="text-sm text-[var(--color-accent)] font-medium">
                                            {weeklyWeightGoal > 0 ? "+" : ""}{weeklyWeightGoal.toFixed(1)} kg
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        step="0.5"
                                        value={weeklyWeightGoal}
                                        onChange={(e) => setWeeklyWeightGoal(Number(e.target.value))}
                                        className="w-full h-2 bg-[var(--muted)] rounded-full appearance-none cursor-pointer accent-[var(--color-accent)]"
                                    />
                                    <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                                        <span>-10 kg</span>
                                        <span>0</span>
                                        <span>+10 kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Level */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Activity Level</h2>
                            <p className="text-[var(--muted-foreground)] text-sm mb-6">How active are you on a typical day?</p>

                            <div className="grid md:grid-cols-3 gap-4">
                                {activityLevels.map((level) => (
                                    <button
                                        key={level.id}
                                        onClick={() => setActivityLevel(level.id)}
                                        className={`p-5 rounded-2xl text-left transition-all ${activityLevel === level.id
                                            ? "bg-[var(--color-accent)]/20 border-2 border-[var(--color-accent)]"
                                            : "bg-[var(--card)] border border-[var(--border)] hover:border-[var(--muted-foreground)]"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activityLevel === level.id
                                            ? "bg-[var(--color-accent)] text-white"
                                            : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                                            }`}>
                                            <level.icon size={20} />
                                        </div>
                                        <h3 className="font-bold text-sm mb-1">{level.label}</h3>
                                        <p className="text-xs text-[var(--muted-foreground)]">{level.description}</p>
                                    </button>
                                ))}
                            </div>
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
