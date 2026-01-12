'use client';

import React, { useState } from 'react';
import Link from "next/link";
import {
    Dumbbell,
    Flame,
    Clock,
    CalendarDays,
    Upload,
    Play,
    ArrowRight,
    X,
    ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

import AddWorkoutModal from "@/app/components/AddWorkoutModal";
import LibraryItem from "@/app/components/LibraryItem";

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
    // --- 1. STATE FOR LOGIC ---
    const [activeTab, setActiveTab] = useState("All");
    const [showStartVideo, setShowStartVideo] = useState(false);

    // --- 2. DATA ---
    // Use props for stats
    const statsData = [
        { label: "Workouts this week", value: stats.thisWeek.toString(), icon: Dumbbell, color: "bg-orange-500/20 text-orange-500" },
        { label: "Calories burned", value: stats.calories, icon: Flame, color: "bg-red-500/20 text-red-500" },
        { label: "Active Minutes", value: stats.activeMinutes, icon: Clock, color: "bg-green-500/20 text-green-500" },
        { label: "Planned Sessions", value: "3", icon: CalendarDays, color: "bg-purple-500/20 text-purple-500" }, // Keep mocked for now
    ];

    const filterTabs = ["All", "Cardio", "Strength", "Flexibility"];

    // Mock upcoming schedule for now
    const upcomingSchedule = [
        { day: "Tomorrow, 7:00 AM", title: "Morning Run", subtitle: "5km interval training", duration: "30 min", calories: "300 cal", color: "bg-orange-500" },
        { day: "Friday, 6:00 PM", title: "Yoga Flow", subtitle: "Recovery & Flexibility", duration: "60 min", calories: "150 cal", color: "bg-purple-500" },
        { day: "Sunday, 7:00 AM", title: "Power Lifting", subtitle: "Power Lifting training", duration: "50 min", calories: "380 cal", color: "bg-blue-500" },
    ];

    const libraryItems = [
        {
            title: "HIIT Blast Level 2",
            duration: "20 min",
            type: "Cardio",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop",
            videoId: "ml6cT4AZdqI",
            description: "A high-energy HIIT session designed to maximize calorie burn."
        },
        {
            title: "Leg Day Crusher",
            duration: "55 min",
            type: "Strength",
            image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop",
            videoId: "RjexvOAsVtI",
            description: "Complete lower body destruction focusing on quads and glutes."
        },
        {
            title: "Core & Abs",
            duration: "15 min",
            type: "Strength",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop",
            videoId: "dJlFmxiL11s",
            description: "Target your core from every angle."
        },
    ];

    // --- 3. FILTER LOGIC ---
    const filteredWorkouts = libraryItems.filter(workout =>
        activeTab === "All" ? true : workout.type === activeTab
    );

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
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--muted)] transition-colors">
                            <Upload size={16} />
                            Import Plan
                        </button>
                        <AddWorkoutModal />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

                {/* Quick Search + Start Workout + Recent History */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-6">
                        {/* Interactive Tabs */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-[var(--muted-foreground)]">Quick Search:</span>
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === tab
                                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                            : "bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                                    <Play size={12} className="text-orange-500 ml-0.5" />
                                </div>
                                <span className="text-sm text-[var(--muted-foreground)]">Ready to start?</span>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden h-48 group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800')" }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 text-xs rounded-full">Strength</span>
                                        <span className="text-xs text-white/70">45 min</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 text-white">Upper Body Power</h3>
                                    <p className="text-xs text-white/60 mb-3">Up next in schedule. Equipment needed: Dumbbells.</p>
                                    <button
                                        onClick={() => setShowStartVideo(true)}
                                        className="self-start flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-all active:scale-95"
                                    >
                                        Start Workout <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
                        <h3 className="text-lg font-bold mb-4">Recent History</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {initialWorkouts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center bg-[var(--muted)]/30 rounded-xl border border-[var(--border)]/50">
                                    <ClipboardList className="text-[var(--muted-foreground)] mb-2" size={24} />
                                    <p className="text-sm font-medium text-[var(--foreground)]">No workouts yet</p>
                                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Start training to fill this up!</p>
                                </div>
                            ) : (
                                initialWorkouts.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-[var(--border)]/50 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <div>
                                                <div className="text-xs text-[var(--muted-foreground)]">{item.day}</div>
                                                <div className="text-sm font-medium">{item.title}</div>
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
                </div>

                {/* Upcoming Schedule */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Upcoming Schedule</h2>
                        <Link href="/calendar" className="text-sm text-orange-500 hover:underline">
                            View Calendar
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {upcomingSchedule.map((item, index) => (
                            <div key={index} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-8 h-8 rounded-lg ${item.color}/20 flex items-center justify-center`}>
                                        <Dumbbell size={16} className={item.color.replace("bg-", "text-")} />
                                    </div>
                                    <span className="text-xs text-[var(--muted-foreground)]">{item.day}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                <p className="text-xs text-[var(--muted-foreground)] mb-4">{item.subtitle}</p>
                                <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} /> {item.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Flame size={12} /> {item.calories}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Library + Weekly Goal */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Library</h2>
                            <Link href="/library" className="text-sm text-orange-500 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {filteredWorkouts.map((item, index) => (
                                <LibraryItem key={index} item={item} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-fit">
                        <h3 className="text-lg font-bold mb-2">Weekly Goal</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mb-6">4 of 5 workouts completed</p>
                        <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-orange-500" style={{ width: "80%" }} />
                        </div>
                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold text-orange-500">80%</div>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] text-center mb-6">
                            You&apos;re crushing it! Just <span className="text-orange-500">1 more workout</span> to hit your target.
                        </p>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--card)] transition-colors">
                            Continue where you left off <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Video Modal */}
            <AnimatePresence>
                {showStartVideo && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStartVideo(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                            <iframe className="w-full h-full" src="https://www.youtube.com/embed/ml6cT4AZdqI?autoplay=1" allow="autoplay; encrypted-media" allowFullScreen />
                            <button onClick={() => setShowStartVideo(false)} className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-orange-500 rounded-full text-white transition-colors">
                                <X size={24} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-[var(--border)] bg-[var(--background)] mt-12">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-12">
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-sm">N</div>
                            <span className="font-bold text-lg tracking-wide">Nexus</span>
                        </Link>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
                            Empowering athletes everywhere to reach their peak performance through data and discipline.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Testimonials</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
