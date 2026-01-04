import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Dumbbell,
    Flame,
    Clock,
    CalendarDays,
    Upload,
    Plus,
    Play,
    MoreVertical,
    ArrowRight,
} from "lucide-react";

// Placeholder data
const statsData = [
    { label: "Workouts this week", value: "4", icon: Dumbbell, color: "bg-orange-500/20 text-orange-500" },
    { label: "Calories burned", value: "1,250", icon: Flame, color: "bg-red-500/20 text-red-500" },
    { label: "Active Minutes", value: "320", icon: Clock, color: "bg-green-500/20 text-green-500" },
    { label: "Planned Sessions", value: "3", icon: CalendarDays, color: "bg-purple-500/20 text-purple-500" },
];

const filterTabs = ["All Types", "Cardio", "Strength", "Flexibility"];

const recentHistory = [
    { day: "Yesterday", title: "Full Body Strength", duration: "50 min", calories: "420 kcal" },
    { day: "Monday", title: "Cycling Indoors", duration: "45 min", calories: "380 kcal" },
    { day: "Sunday", title: "Light Stretching", duration: "45 min", calories: "380 kcal" },
];

const upcomingSchedule = [
    { day: "Tomorrow, 7:00 AM", title: "Morning Run", subtitle: "5km interval training", duration: "30 min", calories: "300 cal", color: "bg-orange-500" },
    { day: "Friday, 6:00 PM", title: "Yoga Flow", subtitle: "Recovery & Flexibility", duration: "60 min", calories: "150 cal", color: "bg-purple-500" },
    { day: "Sunday, 7:00 AM", title: "Power Lifting", subtitle: "Power Lifting training", duration: "50 min", calories: "380 cal", color: "bg-blue-500" },
];

const libraryItems = [
    { title: "HIIT Blast Level 2", duration: "20 min", type: "Intense", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=150&fit=crop" },
    { title: "Leg Day Crusher", duration: "55 min", type: "Strength", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=150&fit=crop" },
    { title: "Core & Abs", duration: "15 min", type: "Bodyweight", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=150&fit=crop" },
];

export default async function WorkoutsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                {/* Title Section */}
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
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                            <Plus size={16} />
                            Add New Workout
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statsData.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4"
                        >
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

                {/* Quick Search + Ready to Start + Recent History */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Quick Search */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-[var(--muted-foreground)]">Quick Search:</span>
                            {filterTabs.map((tab, index) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${index === 0
                                        ? "bg-[var(--color-accent)] text-white"
                                        : "bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Ready to Start */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center">
                                    <Play size={12} className="text-[var(--color-accent)] ml-0.5" />
                                </div>
                                <span className="text-sm text-[var(--muted-foreground)]">Ready to start?</span>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden h-48">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop')",
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs rounded-full">Strength</span>
                                        <span className="text-xs text-[var(--muted-foreground)]">45 min</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Upper Body Power</h3>
                                    <p className="text-xs text-[var(--muted-foreground)] mb-3">Up next in schedule. Equipment needed: Dumbbells.</p>
                                    <button className="self-start flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
                                        Start Workout <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Recent History */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
                        <h3 className="text-lg font-bold mb-4">Recent History</h3>
                        <div className="space-y-4">
                            {recentHistory.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--border)]/50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
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
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Upcoming Schedule</h2>
                        <Link href="/calendar" className="text-sm text-[var(--color-accent)] hover:underline">
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
                                        <Clock size={12} />
                                        {item.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Flame size={12} />
                                        {item.calories}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Your Library + Weekly Goal */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Your Library - Takes 2 columns */}
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Library</h2>
                            <Link href="/library" className="text-sm text-[var(--color-accent)] hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {libraryItems.map((item, index) => (
                                <div key={index} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4">
                                    <div
                                        className="w-20 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
                                        style={{ backgroundImage: `url('${item.image}')` }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate">{item.title}</h4>
                                        <p className="text-xs text-[var(--muted-foreground)]">{item.duration} · {item.type}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--muted)] transition-colors">
                                            <Play size={16} className="ml-0.5" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Goal */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-2">Weekly Goal</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mb-6">4 of 5 workouts completed</p>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: "80%" }} />
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold text-[var(--color-accent)]">80%</div>
                        </div>

                        <p className="text-sm text-[var(--muted-foreground)] text-center mb-6">
                            You&apos;re crushing it! Just <span className="text-[var(--color-accent)]">1 more workout</span> to hit your weekly target.
                        </p>

                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--muted)] border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--card)] transition-colors">
                            Continue where you left off <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-[var(--border)] bg-[var(--background)] mt-12">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-12">
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">
                                N
                            </div>
                            <span className="font-bold text-lg tracking-wide text-[var(--foreground)]">Nexus</span>
                        </Link>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
                            Empowering athletes everywhere to reach their peak performance through data and discipline.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--foreground)] mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Testimonials</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--foreground)] mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--foreground)] mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Status</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
                    © {new Date().getFullYear()} Nexus Fitness App. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
