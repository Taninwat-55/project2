"use client";

import Link from "next/link";
import { User, Scale, Ruler, Activity, Flame, Pencil } from "lucide-react";

interface ProfileSummaryCardProps {
    weight?: number;
    height?: number;
    gender?: string;
    activityLevel?: string;
    dailyCalorieGoal?: number;
    className?: string;
}

// Helper to format activity level for display
function formatActivityLevel(level?: string): string {
    if (!level) return "Not set";
    const labels: Record<string, string> = {
        sedentary: "Sedentary",
        lightly_active: "Lightly Active",
        moderately_active: "Moderately Active",
        very_active: "Very Active",
        extra_active: "Extra Active",
    };
    return labels[level] || level;
}

// Helper to format gender for display
function formatGender(gender?: string): string {
    if (!gender) return "Not set";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function ProfileSummaryCard({
    weight,
    height,
    gender,
    activityLevel,
    dailyCalorieGoal,
    className = "",
}: ProfileSummaryCardProps) {
    const stats = [
        {
            label: "Weight",
            value: weight ? `${weight} kg` : "Not set",
            icon: Scale,
        },
        {
            label: "Height",
            value: height ? `${height} cm` : "Not set",
            icon: Ruler,
        },
        {
            label: "Gender",
            value: formatGender(gender),
            icon: User,
        },
        {
            label: "Activity",
            value: formatActivityLevel(activityLevel),
            icon: Activity,
        },
    ];

    return (
        <div className={`bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Your Profile</h3>
                <Link
                    href="/settings"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full text-xs font-medium hover:bg-[var(--color-accent)]/20 transition-colors"
                >
                    <Pencil size={12} />
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 p-3 bg-[var(--muted)]/50 rounded-xl"
                    >
                        <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[var(--muted-foreground)]">
                            <stat.icon size={16} />
                        </div>
                        <div>
                            <div className="text-xs text-[var(--muted-foreground)]">{stat.label}</div>
                            <div className="text-sm font-medium">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {dailyCalorieGoal && dailyCalorieGoal > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                    <div className="flex items-center gap-2">
                        <Flame size={16} className="text-[var(--color-accent)]" />
                        <span className="text-sm text-[var(--muted-foreground)]">Daily Calorie Goal</span>
                        <span className="ml-auto font-bold text-[var(--color-accent)]">
                            {dailyCalorieGoal.toLocaleString("en-US")} kcal
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
