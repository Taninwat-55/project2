import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Archive,
  Clock,
  CalendarDays,
  Flame,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getUserWorkouts } from '@/app/actions/workouts';

interface Workout {
  id: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number | string;
  calories?: number;
  kcal?: number;
  created_at?: string;
  date?: string; // Adding common alternative
  image_url?: string;
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const workoutsData = await getUserWorkouts();
  const allWorkouts = (Array.isArray(workoutsData)
    ? workoutsData
    : []) as unknown as Workout[];

  // --- IMPROVED DATA PARSING ---
  const totalWorkouts = allWorkouts.length;

  const totalMinutes = allWorkouts.reduce((acc, curr) => {
    const val = Number(curr.duration) || 0;
    return acc + val;
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);

  // Safe Date Logic for "Earliest Record"
  let earliestMonth = 'N/A';
  let earliestYear = '';

  if (allWorkouts.length > 0) {
    // Filter out any workouts with missing dates to avoid NaN
    const validDates = allWorkouts
      .map((w) => new Date(w.created_at || w.date || '').getTime())
      .filter((t) => !isNaN(t));

    if (validDates.length > 0) {
      const earliestTimestamp = Math.min(...validDates);
      const d = new Date(earliestTimestamp);
      earliestMonth = d.toLocaleString('en-US', { month: 'short' });
      earliestYear = d.getFullYear().toString();
    }
  }

  const statsData = [
    {
      label: 'TOTAL ARCHIVED',
      value: totalWorkouts.toString(),
      unit: 'Workouts',
      icon: Archive,
    },
    {
      label: 'TIME INVESTED',
      value: totalHours.toString(),
      unit: 'Hours',
      icon: Clock,
    },
    {
      label: 'EARLIEST RECORD',
      value: earliestMonth,
      unit: earliestYear,
      icon: CalendarDays,
    },
  ];

  // --- PAGINATION ---
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedWorkouts = allWorkouts.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(allWorkouts.length / itemsPerPage));

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Workout Archives
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            Browse your past training history and milestones
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-500">
                    {stat.value}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {stat.unit}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-orange-500">
                <stat.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Workout Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {displayedWorkouts.map((workout) => {
            // Safe parsing for Card Date
            const rawDate = workout.created_at || workout.date;
            const dateObj = rawDate ? new Date(rawDate) : null;
            const dateLabel =
              dateObj && !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

            const calories = workout.calories || workout.kcal || 0;

            return (
              <div
                key={workout.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all cursor-pointer group flex flex-col h-full shadow-sm"
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: `url('${
                        workout.image_url ||
                        // We add "lock" and the workout.id to make the image permanent for this specific workout
                        `https://loremflickr.com/800/600/${workout.title
                          .toLowerCase()
                          .replace(/\s+/g, ',')},gym/all?lock=${workout.id}`
                      }')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <span className="absolute top-3 left-3 px-2 py-1 bg-orange-600 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    {workout.category || 'Strength'}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded text-xs font-medium text-white">
                    {dateLabel}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors">
                    {workout.title}
                  </h3>

                  {/* Description Fix */}
                  <p className="text-sm text-[var(--muted-foreground)] mb-6 line-clamp-2 flex-1 leading-relaxed">
                    {workout.description && workout.description.trim() !== ''
                      ? workout.description
                      : 'A dedicated training session focused on performance and growth.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-[var(--muted-foreground)] border-t border-[var(--border)] pt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-orange-500" />
                      {workout.duration || 0} min
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame size={14} className="text-orange-500" />
                      {calories} kcal
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern Pagination Bar */}
        {allWorkouts.length > 0 && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl backdrop-blur-md">
              {/* Previous Button */}
              <Link
                href={`?page=${Math.max(1, currentPage - 1)}`}
                className={`flex items-center gap-2 text-sm font-bold transition-all duration-200 
                    ${
                      currentPage === 1
                        ? 'opacity-20 cursor-not-allowed pointer-events-none'
                        : 'text-[var(--foreground)] hover:text-orange-500'
                    }`}
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
                <span>Previous</span>
              </Link>

              {/* Vertical Divider */}
              <div className="h-6 w-[1px] bg-[var(--border)]" />

              {/* Page Indicator */}
              <div className="flex items-center gap-3">
                <span className="hidden xs:block text-[10px] uppercase tracking-[0.2em] font-black text-[var(--muted-foreground)]">
                  Page
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20">
                    {currentPage}
                  </span>
                  <span className="text-[var(--muted-foreground)] text-sm font-bold">
                    / {totalPages}
                  </span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="h-6 w-[1px] bg-[var(--border)]" />

              {/* Next Button */}
              <Link
                href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`flex items-center gap-2 text-sm font-bold transition-all duration-200 
                    ${
                      currentPage === totalPages
                        ? 'opacity-20 cursor-not-allowed pointer-events-none'
                        : 'text-[var(--foreground)] hover:text-orange-500'
                    }`}
              >
                <span>Next</span>
                <ChevronRight size={20} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
