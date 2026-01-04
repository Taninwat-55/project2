import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Flame,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Trophy,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

// Placeholder data - replace with real data later
const statsData = [
  { label: "Total Distance", value: "142", unit: "Km", change: "+9%", up: true, icon: MapPin, color: "text-orange-500" },
  { label: "Calories", value: "2.5", unit: "K", change: "+5%", up: true, icon: Flame, color: "text-red-500" },
  { label: "Active Time", value: "1,820", unit: "min", change: "-2%", up: false, icon: Clock, color: "text-green-500" },
  { label: "Streak", value: "12", unit: "days", change: "+1 day", up: true, icon: Zap, color: "text-blue-500" },
];

const weeklyGoals = [
  { label: "Running", current: 35, target: 45, unit: "km", color: "bg-orange-500" },
  { label: "Strength", current: 3, target: 5, unit: "days", color: "bg-blue-500" },
  { label: "Mindfulness", current: 10, target: 60, unit: "min", color: "bg-purple-500" },
];

const weeklyRecords = [
  { label: "Fastest 5k", value: "24:32 min", subtext: "Tuesday", icon: Trophy },
  { label: "Max Deadlift", value: "185 kg", subtext: "Yesterday", icon: Dumbbell },
];

const activityData = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 60 },
  { day: "Thu", value: 100 },
  { day: "Fri", value: 40 },
  { day: "Sat", value: 55 },
  { day: "Sun", value: 35 },
];

const recentHistory = [
  { activity: "Morning Run", location: "Central Park loop", date: "Today, 7:30 AM", duration: "45m 12s", calories: "480 Kcal", status: "Completed" },
  { activity: "Upper Body", location: "Gym Session", date: "Yesterday, 6:00 PM", duration: "1h 15m", calories: "320 Kcal", status: "Completed" },
  { activity: "Vinyasa Flow", location: "Home Workout", date: "Oct 24, 8:00 PM", duration: "30m 00s", calories: "120 Kcal", status: "Completed" },
  { activity: "Cycling", location: "Interval Training", date: "Oct 22, 5:45 PM", duration: "45m 00s", calories: "560 Kcal", status: "Completed" },
];

const filterTabs = ["All Activities", "Running", "Cycling", "Weight lifting", "Yoga"];

export default async function Dashboard() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const maxActivityValue = Math.max(...activityData.map((d) => d.value));

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

        {/* Filter Tabs */}
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
              <div className={`flex items-center gap-1 text-xs ${stat.up ? "text-green-500" : "text-red-500"}`}>
                {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
              <h2 className="text-xl font-bold">Activity Volume</h2>
              <div className="flex gap-2">
                <button className="p-2 bg-[var(--muted)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <BarChart3 size={18} />
                </button>
                <button className="p-2 bg-[var(--card)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <LineChart size={18} />
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-48 mb-4">
              {activityData.map((item, index) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center">
                    {index === 3 && (
                      <span className="text-xs text-[var(--color-accent)] font-medium mb-1">
                        890 cal
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-full rounded-t-lg transition-all ${index === 3 ? "bg-[var(--color-accent)]" : "bg-[var(--muted)]/50"
                      }`}
                    style={{ height: `${(item.value / maxActivityValue) * 100}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Day Labels */}
            <div className="flex justify-between">
              {activityData.map((item, index) => (
                <span
                  key={item.day}
                  className={`text-xs flex-1 text-center ${index === 3 ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-foreground)]"
                    }`}
                >
                  {item.day}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weekly Goals */}
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

            {/* Weekly Records */}
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
              href="/history"
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
                {recentHistory.map((item, index) => (
                  <tr key={index} className="border-b border-[var(--border)]/50 last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--color-accent)]/20 rounded-lg flex items-center justify-center text-[var(--color-accent)]">
                          <Zap size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{item.activity}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">{item.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-[var(--muted-foreground)]">{item.date}</td>
                    <td className="py-4 text-sm text-[var(--muted-foreground)]">{item.duration}</td>
                    <td className="py-4 text-sm text-[var(--muted-foreground)]">{item.calories}</td>
                    <td className="py-4">
                      <span className="text-sm text-[var(--color-accent)]">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
