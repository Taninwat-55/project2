'use client';

import { useState } from 'react';
import { Clock, Flame, X, CalendarDays, Lightbulb, Target } from 'lucide-react';

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

export default function ArchiveGrid({ workouts }: { workouts: Workout[] }) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const getWorkoutInsight = (workout: Workout) => {
    const duration = Number(workout.duration) || 0;
    const calories = Number(workout.calories || workout.kcal) || 0;

    if (calories > 400) return "High-intensity session. Prioritize protein intake and sleep for recovery.";
    if (duration > 50) return "Endurance-focused training. Focus on replenishing electrolytes.";
    return "Consistency is key. Regular sessions contribute significantly to long-term health.";
  };

  return (
    <>
      {/* Custom Modern Scrollbar Styles */}
      <style jsx global>{`
        .modern-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .modern-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .modern-scroll::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.3);
          border-radius: 10px;
        }
      `}</style>

      {/* Grid of Workout Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {workouts.map((workout) => (
          <div 
            key={workout.id} 
            onClick={() => setSelectedWorkout(workout)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col h-full shadow-lg cursor-pointer active:scale-[0.98]"
          >
            <div className="relative h-48 overflow-hidden shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url('${workout.image_url || `https://loremflickr.com/800/600/${(workout.category || 'fitness').toLowerCase()},gym/all?lock=${workout.id}`}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="p-6 flex flex-col flex-1 text-white">
              <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">{workout.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-6 line-clamp-2 italic">
                {workout.description || 'A dedicated training session focused on performance.'}
              </p>
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1 text-[var(--muted-foreground)]"><Clock size={14} className="text-orange-500" /> {workout.duration}m</span>
                  <span className="flex items-center gap-1 text-[var(--muted-foreground)]"><Flame size={14} className="text-orange-500" /> {workout.calories || workout.kcal || 0} kcal</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL WITH GLASS EFFECT */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Glassmorphism Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-in fade-in duration-500" 
            onClick={() => setSelectedWorkout(null)} 
          />
          
          {/* Modal Container */}
          <div className="relative bg-[var(--card)] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            
            {/* Header Image */}
            <div className="relative h-44 md:h-56 shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${selectedWorkout.image_url || `https://loremflickr.com/800/600/${(selectedWorkout.category || 'fitness').toLowerCase()},gym/all?lock=${selectedWorkout.id}`}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
              <button 
                onClick={() => setSelectedWorkout(null)}
                className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-orange-500 transition-all z-10 border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="modern-scroll overflow-y-auto px-6 pb-6 md:px-10 md:pb-10 pt-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase rounded-full border border-orange-500/20">
                  {selectedWorkout.category || 'Training'}
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest flex items-center gap-1">
                  <CalendarDays size={12} className="text-orange-500" />
                  {new Date(selectedWorkout.created_at || selectedWorkout.date || '').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{selectedWorkout.title}</h2>
              <p className="text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed mb-8 italic opacity-80 border-l-2 border-orange-500/20 pl-4">
                &quot;{selectedWorkout.description || 'A high-performance session tracked in your fitness journey.'}&quot;
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/[0.05]">
                  <div className="text-[10px] text-orange-500 uppercase font-black mb-1">Time Elapsed</div>
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    {selectedWorkout.duration} <span className="text-xs font-medium text-[var(--muted-foreground)]">MIN</span>
                  </div>
                </div>
                <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/[0.05]">
                  <div className="text-[10px] text-orange-500 uppercase font-black mb-1">Energy Output</div>
                  <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                    {selectedWorkout.calories || selectedWorkout.kcal || 0} <span className="text-xs font-medium text-[var(--muted-foreground)]">KCAL</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-blue-500/[0.03] border border-blue-500/10">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase mb-2">
                    <Lightbulb size={14} /> Workout Insight
                  </div>
                  <p className="text-sm text-blue-100/60 leading-relaxed">
                    {getWorkoutInsight(selectedWorkout)}
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-orange-500/[0.03] border border-orange-500/10">
                  <div className="flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase mb-2">
                    <Target size={14} /> Performance Goal
                  </div>
                  <p className="text-sm text-orange-100/60 leading-relaxed">
                    Optimizes metabolic flexibility and increases caloric afterburn for 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-6 md:px-10 bg-[var(--card)]/80 backdrop-blur-md border-t border-white/[0.05]">
              <button 
                onClick={() => setSelectedWorkout(null)}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]"
              >
                Return to Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}