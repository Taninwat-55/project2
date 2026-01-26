import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Archive,
  Clock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { getArchivedWorkouts } from '@/app/actions/workouts';
import ArchiveGrid from '@/app/components/ArchiveGrid'; // Import the new component

interface Workout {
  id: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number | string;
  calories?: number;
  kcal?: number;
  created_at?: string;
  date?: string;
  image_url?: string;
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const workoutsData = await getArchivedWorkouts();

  const allWorkouts = (Array.isArray(workoutsData) ? workoutsData : [])
    .map((w: unknown) => w as Workout)
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.date || 0).getTime();
      const dateB = new Date(b.created_at || b.date || 0).getTime();
      return dateB - dateA;
    });

  // Stats Calculation
  const totalWorkouts = allWorkouts.length;
  const totalMinutes = allWorkouts.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);

  let earliestMonth = 'N/A';
  let earliestYear = '';

  if (allWorkouts.length > 0) {
    const validDates = allWorkouts
      .map((w) => new Date(w.created_at || w.date || '').getTime())
      .filter((t) => !isNaN(t));

    if (validDates.length > 0) {
      const d = new Date(Math.min(...validDates));
      earliestMonth = d.toLocaleString('en-US', { month: 'short' });
      earliestYear = d.getFullYear().toString();
    }
  }

  const statsData = [
    { label: 'TOTAL ARCHIVED', value: totalWorkouts.toString(), unit: 'Workouts', icon: Archive },
    { label: 'TIME INVESTED', value: totalHours.toString(), unit: 'Hours', icon: Clock },
    { label: 'EARLIEST RECORD', value: earliestMonth, unit: earliestYear, icon: CalendarDays },
  ];

  // Pagination Logic
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(allWorkouts.length / itemsPerPage));
  const displayedWorkouts = allWorkouts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">

        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Workout Archives</h1>
            <p className="text-[var(--muted-foreground)] text-sm">Your journey, logged and preserved.</p>
          </div>
          <Link href="/workouts" className="hidden md:flex items-center gap-2 text-orange-500 hover:text-orange-400 text-sm font-bold transition-colors">
            <PlusCircle size={18} />
            Find New Workouts
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {statsData.map((stat) => (
            <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest mb-2 font-semibold">{stat.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-500">{stat.value}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">{stat.unit}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Workout Grid (Now using the Interactive Client Component) */}
        {allWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--card)]/30">
            <Archive size={48} className="text-[var(--muted-foreground)] mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2 text-white">No archived workouts yet</h3>
            <p className="text-[var(--muted-foreground)] mb-6 text-center max-w-xs">Save your first workout to see it here!</p>
            <Link href="/workouts" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-all">
              Go to Workouts
            </Link>
          </div>
        ) : (
          <ArchiveGrid workouts={displayedWorkouts} />
        )}

        {/* Pagination Bar */}
        {allWorkouts.length > itemsPerPage && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl backdrop-blur-md">
              <Link
                href={`?page=${Math.max(1, currentPage - 1)}`}
                className={`flex items-center gap-2 text-sm font-bold transition-all ${currentPage === 1 ? 'opacity-20 pointer-events-none' : 'text-white hover:text-orange-500'}`}
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
                <span>Previous</span>
              </Link>
              <div className="h-6 w-[1px] bg-[var(--border)]" />
              <div className="flex items-center gap-3 text-white">
                <span className="text-[10px] uppercase font-black text-[var(--muted-foreground)]">Page</span>
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 text-white text-sm font-bold">
                  {currentPage}
                </span>
                <span className="text-[var(--muted-foreground)] text-sm">/ {totalPages}</span>
              </div>
              <div className="h-6 w-[1px] bg-[var(--border)]" />
              <Link
                href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`flex items-center gap-2 text-sm font-bold transition-all ${currentPage === totalPages ? 'opacity-20 pointer-events-none' : 'text-white hover:text-orange-500'}`}
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