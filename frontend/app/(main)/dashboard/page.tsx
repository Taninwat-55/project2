import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  Clock,
  Zap,
  TrendingUp,
  BarChart3,
  Trophy,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

// Helper to format duration
function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Helper to format date relative or absolute
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1 && now.getDate() === date.getDate()) {
    return "Today, " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Check for yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday, " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ", " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper to calculate streak
function calculateStreak(dates: Date[]) {
  if (dates.length === 0) return 0;

  // Sort dates descending
  const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's activity today or yesterday to keep streak alive
  const lastActivity = new Date(sortedDates[0]);
  lastActivity.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return 0; // Streak broken

  let streak = 1;
  const currentDate = lastActivity;

  // Simple streak logic: check consecutive days
  // We need to filter unique days first to avoid counting same day multiple workouts as streak
  const uniqueDays = new Set<number>();
  uniqueDays.add(currentDate.getTime());

  const distinctDates = [currentDate];

  for (const d of sortedDates) {
    const dNorm = new Date(d);
    dNorm.setHours(0, 0, 0, 0);
    if (!uniqueDays.has(dNorm.getTime())) {
      uniqueDays.add(dNorm.getTime());
      distinctDates.push(dNorm);
    }
  }

  // Check consecutiveness
  for (let i = 0; i < distinctDates.length - 1; i++) {
    const current = distinctDates[i];
    const next = distinctDates[i + 1];

    const diff = Math.abs(current.getTime() - next.getTime());
    const daysDiff = Math.round(diff / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default async function Dashboard() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Workouts
  const { data: workouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("performed_at", { ascending: false });

  const recentWorkouts = workouts || [];

  // Calculate Stats
  const totalWorkouts = recentWorkouts.length;
  const totalDurationMinutes = recentWorkouts.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
  const totalCaloriesBurned = recentWorkouts.reduce((acc, curr) => acc + (curr.calories_burned || 0), 0);

  // Prepare dates for streak calculation
  const workoutDates = recentWorkouts.map(w => new Date(w.performed_at));
  const currentStreak = calculateStreak(workoutDates);

  // Stats Data
  const statsData = [
    {
      label: "Total Workouts",
      value: totalWorkouts.toString(),
      unit: "sessions",
      change: "All time",
      up: true,
      icon: Dumbbell,
      color: "text-orange-500"
    },
    {
      label: "Calories Burned",
      value: totalCaloriesBurned > 1000 ? `${(totalCaloriesBurned / 1000).toFixed(1)}K` : totalCaloriesBurned.toString(),
      unit: totalCaloriesBurned > 1000 ? "" : "kcal",
      change: "All time",
      up: true,
      icon: Flame,
      color: "text-red-500"
    },
    {
      label: "Active Time",
      value: totalDurationMinutes > 60 ? Math.floor(totalDurationMinutes / 60).toString() : totalDurationMinutes.toString(),
      unit: totalDurationMinutes > 60 ? "hours" : "min",
      change: "All time",
      up: true,
      icon: Clock,
      color: "text-green-500"
    },
    {
      label: "Current Streak",
      value: currentStreak.toString(),
      unit: "days",
      change: "Keep it up!",
      up: true,
      icon: Zap,
      color: "text-blue-500"
    },
  ];

  // Activity Data (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // 6 days ago to today
    return d;
  });

  const activityData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayWorkouts = recentWorkouts.filter(w => w.performed_at.startsWith(dateStr));
    const value = dayWorkouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
      fullDate: dateStr,
      value: value
    };
  });

  const maxVal = Math.max(...activityData.map((d) => d.value));
  const maxActivityValue = maxVal > 60 ? maxVal : 60; // Minimum scale unless zero

  // Placeholder for Goals and Records (These require more complex schema/backend logic not present yet)
  const weeklyGoals = [
    { label: "Running", current: 35, target: 45, unit: "km", color: "bg-orange-500" },
    { label: "Strength", current: 3, target: 5, unit: "days", color: "bg-blue-500" },
    { label: "Mindfulness", current: 10, target: 60, unit: "min", color: "bg-purple-500" },
  ];

  // Weekly Records (Placeholder for now)
  const weeklyRecords = [
    { label: "Longest Run", value: "24:32 min", subtext: "Tuesday", icon: Trophy },
    { label: "Max Volume", value: "1850 kg", subtext: "Yesterday", icon: Dumbbell },
  ];

  // Filter tabs
  const filterTabs = ["All Activities", "Running", "Cycling", "Weight lifting", "Yoga"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Performance <span className="text-[var(--color-accent)]">Analytics</span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm">Deep dive into your fitness metrics and progress.</p>
        </div>

        {/* Filter Tabs (Visual only for now) */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filterTabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${index === 0
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[var(--muted-foreground)] text-sm">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-[var(--muted-foreground)] text-sm">{stat.unit}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${stat.up ? "text-green-500" : "text-green-500"}`}>
                <TrendingUp size={14} />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Activity Volume Chart - Takes 2 columns */}
          <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Activity Volume (Last 7 Days)</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-48 mb-4">
              {activityData.map((item, index) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center">
                    {/* Optional numeric label could go here */}
                  </div>
                  <div
                    className={`w-full rounded-t-lg transition-all ${index === 6 ? "bg-[var(--color-accent)]" : "bg-[var(--muted)]/50"
                      }`}
                    style={{ height: `${maxActivityValue > 0 ? (item.value / maxActivityValue) * 100 : 0}%` }}
                    title={`${item.value} mins`}
                  />
                </div>
              ))}
            </div>

            {/* Day Labels */}
            <div className="flex justify-between">
              {activityData.map((item, index) => (
                <span
                  key={item.day}
                  className={`text-xs flex-1 text-center ${index === 6 ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-foreground)]"
                    }`}
                >
                  {item.day}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weekly Goals - Placeholder for now as we don't have user goals table yet */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
              <h3 className="text-lg font-bold mb-4">Weekly Goals</h3>
              <div className="space-y-4">
                {weeklyGoals.map((goal) => (
                  <div key={goal.label} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${goal.color}`} />
                        <span className="text-[var(--card-foreground)]/80">{goal.label}</span>
                      </div>
                      <span className="text-[var(--muted-foreground)]">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${goal.color} rounded-full transition-all`}
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Records - Placeholder */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
              <h3 className="text-lg font-bold mb-4">Weekly Records</h3>
              <div className="space-y-4">
                {weeklyRecords.map((record) => (
                  <div key={record.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-full flex items-center justify-center text-[var(--color-accent)]">
                      <record.icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--card-foreground)]/80">{record.label}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {record.value} · {record.subtext}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent History</h2>
            <Link
              href="/workouts"
              className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              see more <ArrowRight size={16} />
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
                  <th className="pb-3 font-medium">Activity</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Calories</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWorkouts.slice(0, 5).map((workout) => (
                  <tr key={workout.id} className="border-b border-[var(--border)]/50 last:border-0 hover:bg-[var(--muted)]/20 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--color-accent)]/20 rounded-lg flex items-center justify-center text-[var(--color-accent)]">
                          <Zap size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{workout.name}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">Workout</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-[var(--muted-foreground)]">
                      {formatDate(workout.performed_at)}
                    </td>
                    <td className="py-4 text-sm text-[var(--muted-foreground)]">
                      {formatDuration(workout.duration_minutes || 0)}
                    </td>
                    <td className="py-4 text-sm text-[var(--muted-foreground)]">
                      {workout.calories_burned} Kcal
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-[var(--color-accent)] capitalize">{workout.status || "Completed"}</span>
                    </td>
                  </tr>
                ))}
                {recentWorkouts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[var(--muted-foreground)]">
                      No workouts found. Start logging your activities!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[var(--border)] bg-[var(--background)] mt-12 w-full">
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
