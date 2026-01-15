'use client';

import { useState, useEffect } from 'react';
import {
  Dumbbell,
  Flame,
  Clock,
  BookmarkPlus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

import AddWorkoutModal from '@/app/components/AddWorkoutModal';
import { saveToArchive, deleteWorkout } from '@/app/actions/workouts';
import { Trash2 } from "lucide-react";

// --------------------------------------------------
// Types
// --------------------------------------------------
interface Workout {
  id: string;
  title: string;
  duration: string;
  calories: string;
  day?: string;
  date?: string;
}

interface WorkoutsContentProps {
  initialWorkouts: Workout[];
  stats?: {
    thisWeek: number;
    calories: string;
    activeMinutes: string;
  };
  mode?: 'workouts' | 'archive';
}

export default function WorkoutsContent({
  initialWorkouts,
  stats,
  mode = 'workouts',
}: WorkoutsContentProps) {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Sync state when server data changes (after router.refresh())
  useEffect(() => {
    setWorkouts(initialWorkouts);
  }, [initialWorkouts]);

  // --------------------------------------------------
  // SAVE (only used on workouts page)
  // --------------------------------------------------
  const handleSave = async (workout: Workout) => {
    setSavingId(workout.id);

    const result = await saveToArchive({
      id: workout.id, // CRITICAL: This must be the actual ID from the DB
      title: workout.title,
      duration: workout.duration,
      calories: workout.calories,
      category: 'Training',
      description: `Logged on ${workout.day}`,
    });

    if (result.success) {
      setMessage(`Saved: ${workout.title}`);
      setTimeout(() => setMessage(null), 3000);
    }
    setSavingId(null);
  };

  // --------------------------------------------------
  // DELETE (only used on archive page)
  const handleDelete = async (id: string) => {
    // 1. Immediate log to see if the button even works
    console.log("Button clicked for ID:", id);

    // 2. Alert to interrupt the UI
    if (!window.confirm("Confirm Permanent Delete?")) return;

    setSavingId(id);

    try {
      const result = await deleteWorkout(id);
      console.log("Server response:", result);

      if (result.success) {
        setMessage("Deleted!");
        // FORCE REFRESH: This is the most reliable way to clear the UI
        window.location.reload();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Critical error in handleDelete:", err);
    } finally {
      setSavingId(null);
    }
  };

  const statsData = stats
    ? [
      {
        label: 'Workouts this week',
        value: stats.thisWeek.toString(),
        icon: Dumbbell,
        color: 'bg-orange-500/20 text-orange-500',
      },
      {
        label: 'Calories burned',
        value: stats.calories,
        icon: Flame,
        color: 'bg-red-500/20 text-red-500',
      },
      {
        label: 'Active Minutes',
        value: stats.activeMinutes,
        icon: Clock,
        color: 'bg-green-500/20 text-green-500',
      },
    ]
    : [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative">
      {/* Success/Error Message Overlay */}
      {message && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20">
            <CheckCircle2 size={18} />
            <span className="font-bold text-sm">{message}</span>
          </div>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              {mode === 'archive' ? 'Workout Archive' : 'My Workouts'}
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm">
              {mode === 'archive'
                ? 'Your completed and saved workouts.'
                : 'Manage your routine and track your history.'}
            </p>
          </div>

          {mode === 'workouts' && <AddWorkoutModal />}
        </div>

        {/* Stats Section (Shows only on main Workouts page) */}
        {stats && mode === 'workouts' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="text-xs text-[var(--muted-foreground)] mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workout List Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <h3 className="text-lg font-bold mb-4 text-white">
            {mode === 'archive' ? 'Saved History' : 'Recent History'}
          </h3>

          {workouts.length === 0 ? (
            <div className="py-10 text-center text-[var(--muted-foreground)]">
              No workouts found.
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-[var(--border)]/50 last:border-0"
                >
                  {/* Left Side: Title and Date */}
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <div>
                      {item.day && (
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {item.day}
                        </div>
                      )}
                      <div className="text-base font-medium text-white">
                        {item.title}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Metrics and Actions */}
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[var(--muted)] rounded-full text-xs text-[var(--muted-foreground)]">
                      {item.duration}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* SAVE BUTTON: Only visible in 'workouts' mode */}
                      {mode === 'workouts' && (
                        <button
                          onClick={() => handleSave(item)}
                          disabled={savingId === item.id}
                          title="Save to Archive"
                          className="p-2 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {savingId === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <BookmarkPlus size={16} />
                          )}
                        </button>
                      )}

                      {/* DELETE BUTTON: Visible in both modes */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={savingId === item.id}
                        title="Delete Permanently"
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {savingId === item.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}