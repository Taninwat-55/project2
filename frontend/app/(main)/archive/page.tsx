import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Archive,
    Clock,
    CalendarDays,
    Flame,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// Placeholder data
const statsData = [
    { label: "TOTAL ARCHIVED", value: "36", unit: "Workouts", icon: Archive },
    { label: "TIME INVESTED", value: "120", unit: "Hours", icon: Clock },
    { label: "EARLIEST RECORD", value: "Jan", unit: "2024", icon: CalendarDays },
];

const archivedWorkouts = [
    {
        title: "Upper Body Power",
        description: "Focus on chest and triceps hypertrophy with progressive...",
        category: "Strength",
        categoryColor: "bg-orange-500",
        date: "Oct 24",
        duration: "45 min",
        calories: "320 Kcal",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    },
    {
        title: "Morning 5k Run",
        description: "Consistent pace, slight incline on last mile.",
        category: "Cardio",
        categoryColor: "bg-red-500",
        date: "Oct 27",
        duration: "28 min",
        calories: "290 Kcal",
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop",
    },
    {
        title: "Full Body Stretch",
        description: "Post-leg day recovery session focusing on hips.",
        category: "Recovery",
        categoryColor: "bg-green-500",
        date: "Oct 30",
        duration: "20 min",
        calories: "85 Kcal",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    },
    {
        title: "Tabata Inferno",
        description: "High intensity intervals. 20s on, 10s off.",
        category: "HIIT",
        categoryColor: "bg-purple-500",
        date: "Oct 31",
        duration: "30 min",
        calories: "410 Kcal",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
    },
    {
        title: "Leg Day: Squats",
        description: "Heavy compound movements focusing on quads.",
        category: "Strength",
        categoryColor: "bg-orange-500",
        date: "Oct 15",
        duration: "60 min",
        calories: "350 Kcal",
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
    },
    {
        title: "Pool Laps",
        description: "40 laps freestyle, focus on breath control.",
        category: "Cardio",
        categoryColor: "bg-blue-500",
        date: "Oct 14",
        duration: "35 min",
        calories: "400 Kcal",
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop",
    },
];

export default async function ArchivePage() {
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
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Workout Archives</h1>
                    <p className="text-[var(--muted-foreground)] text-sm">Browse your past training history, completed plans, and milestones</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {statsData.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between"
                        >
                            <div>
                                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2">{stat.label}</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-[var(--color-accent)]">{stat.value}</span>
                                    <span className="text-sm text-[var(--muted-foreground)]">{stat.unit}</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--color-accent)]">
                                <stat.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workout Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {archivedWorkouts.map((workout, index) => (
                        <div
                            key={index}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--muted-foreground)] transition-colors cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                    style={{ backgroundImage: `url('${workout.image}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {/* Category Badge */}
                                <span className={`absolute top-3 left-3 px-2 py-1 ${workout.categoryColor} rounded text-xs font-medium`}>
                                    {workout.category}
                                </span>
                                {/* Date Badge */}
                                <span className="absolute bottom-3 right-3 px-2 py-1 bg-[var(--color-accent)] rounded text-xs font-medium">
                                    {workout.date}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-2">{workout.title}</h3>
                                <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">{workout.description}</p>
                                <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {workout.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Flame size={12} />
                                        {workout.calories}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2">
                    <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-medium">
                        1
                    </button>
                    <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        2
                    </button>
                    <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        3
                    </button>
                    <span className="text-[var(--muted-foreground)] px-2">...</span>
                    <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        8
                    </button>
                    <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                        <ChevronRight size={18} />
                    </button>
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
