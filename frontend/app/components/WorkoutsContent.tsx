'use client';

import React, { useState } from 'react';
import Link from "next/link";
import {
    Dumbbell,
    Flame,
    Clock,
    ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

import AddWorkoutModal from "@/app/components/AddWorkoutModal";

interface WorkoutsContentProps {
    initialWorkouts: {
        id: number;
        title: string;
        duration: string;
        calories: string;
        day: string;
        date: string;
    }[];
    stats: {
        thisWeek: number;
        calories: string; // pre-formatted string or number
        activeMinutes: string;
    };
}

export default function WorkoutsContent({ initialWorkouts, stats }: WorkoutsContentProps) {
    const [showStartVideo, setShowStartVideo] = useState(false);

    // --- 2. DATA ---
    const statsData = [
        { label: "Workouts this week", value: stats.thisWeek.toString(), icon: Dumbbell, color: "bg-orange-500/20 text-orange-500" },
        { label: "Calories burned", value: stats.calories, icon: Flame, color: "bg-red-500/20 text-red-500" },
        { label: "Active Minutes", value: stats.activeMinutes, icon: Clock, color: "bg-green-500/20 text-green-500" },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Workouts</h1>
                        <p className="text-[var(--muted-foreground)] text-sm">Manage your routine, schedule sessions and track your history.</p>
                    </div>
                    <div className="flex gap-3">
                        <AddWorkoutModal />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {statsData.map((stat) => (
                        <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div className="text-xs text-[var(--muted-foreground)] mb-1">{stat.label}</div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent History */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
                    <h3 className="text-lg font-bold mb-4">Recent History</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {initialWorkouts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--muted)]/30 rounded-xl border border-[var(--border)]/50">
                                <ClipboardList className="text-[var(--muted-foreground)] mb-4" size={48} />
                                <p className="text-lg font-medium text-[var(--foreground)]">No workouts yet</p>
                                <p className="text-sm text-[var(--muted-foreground)] mt-2">Start training to fill this up!</p>
                            </div>
                        ) : (
                            initialWorkouts.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-4 border-b border-[var(--border)]/50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                                        <div>
                                            <div className="text-xs text-[var(--muted-foreground)] mb-1">{item.day}</div>
                                            <div className="text-base font-medium">{item.title}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="px-3 py-1 bg-[var(--muted)] rounded-full text-xs text-[var(--muted-foreground)]">{item.duration}</span>
                                        <span className="px-3 py-1 bg-[var(--muted)] rounded-full text-xs text-[var(--muted-foreground)]">{item.calories}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
