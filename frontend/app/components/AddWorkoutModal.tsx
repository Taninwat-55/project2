'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Dumbbell, Timer, Flame, ChevronRight, AlertCircle, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';

import { logWorkout } from '@/app/actions/workouts';

// Workout presets with suggested values
const WORKOUT_PRESETS = [
    // Strength exercises
    { name: 'Bench Press', type: 'strength' as const, sets: 4, reps: 10, caloriesPerMin: 5 },
    { name: 'Squats', type: 'strength' as const, sets: 4, reps: 12, caloriesPerMin: 6 },
    { name: 'Deadlift', type: 'strength' as const, sets: 3, reps: 8, caloriesPerMin: 7 },
    { name: 'Shoulder Press', type: 'strength' as const, sets: 3, reps: 10, caloriesPerMin: 4 },
    { name: 'Bicep Curls', type: 'strength' as const, sets: 3, reps: 12, caloriesPerMin: 3 },
    { name: 'Tricep Dips', type: 'strength' as const, sets: 3, reps: 12, caloriesPerMin: 4 },
    { name: 'Leg Press', type: 'strength' as const, sets: 4, reps: 10, caloriesPerMin: 5 },
    { name: 'Pull-ups', type: 'strength' as const, sets: 3, reps: 8, caloriesPerMin: 5 },
    { name: 'Lat Pulldown', type: 'strength' as const, sets: 3, reps: 12, caloriesPerMin: 4 },
    { name: 'Lunges', type: 'strength' as const, sets: 3, reps: 12, caloriesPerMin: 5 },
    // Cardio exercises
    { name: 'Running', type: 'cardio' as const, duration: 30, distance: 5, caloriesPerMin: 10 },
    { name: 'Cycling', type: 'cardio' as const, duration: 45, distance: 15, caloriesPerMin: 8 },
    { name: 'Swimming', type: 'cardio' as const, duration: 30, caloriesPerMin: 9 },
    { name: 'Jump Rope', type: 'cardio' as const, duration: 15, caloriesPerMin: 12 },
    { name: 'Rowing', type: 'cardio' as const, duration: 20, distance: 4, caloriesPerMin: 8 },
    { name: 'HIIT', type: 'cardio' as const, duration: 20, caloriesPerMin: 12 },
    { name: 'Walking', type: 'cardio' as const, duration: 30, distance: 3, caloriesPerMin: 4 },
    { name: 'Elliptical', type: 'cardio' as const, duration: 30, caloriesPerMin: 7 },
];

export default function AddWorkoutModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // --- Form State ---
    const [workoutName, setWorkoutName] = useState('');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [type, setType] = useState<'strength' | 'cardio'>('strength');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [distance, setDistance] = useState('');
    const [workoutDate, setWorkoutDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [showPresets, setShowPresets] = useState(false);

    // Handle selecting a preset
    const handleSelectPreset = (preset: typeof WORKOUT_PRESETS[number]) => {
        setWorkoutName(preset.name);
        setType(preset.type);

        if (preset.type === 'strength') {
            setSets(preset.sets?.toString() || '');
            setReps(preset.reps?.toString() || '');
            // Estimate calories: ~30 min workout at the given rate
            setCalories(Math.round(30 * preset.caloriesPerMin).toString());
            setDuration('30');
            setDistance('');
        } else {
            setDuration(preset.duration?.toString() || '30');
            setDistance(preset.distance?.toString() || '');
            // Calculate calories based on duration
            const dur = preset.duration || 30;
            setCalories(Math.round(dur * preset.caloriesPerMin).toString());
            setSets('');
            setReps('');
        }

        setShowPresets(false);
    };

    const handleSave = async () => {
        // --- NEW: Validation Check ---
        if (!workoutName.trim()) {
            setStatus('error');
            setErrorMessage('Please fill in Name');
            // Reset error after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        const result = await logWorkout({
            name: workoutName,
            duration: duration ? parseInt(duration) : undefined,
            calories: parseInt(calories) || 0,
            status: 'completed',
            type: type,
            sets: parseInt(sets) || undefined,
            reps: parseInt(reps) || undefined,
            weight: parseFloat(weight) || undefined,
            distance: parseFloat(distance) || undefined,
            performedAt: workoutDate || undefined
        });

        if (result.success) {
            setStatus('success');
            router.refresh(); // Trigger server data refresh
            setTimeout(() => {
                setStatus('idle');
                setIsOpen(false);
                // Clear inputs after successful save
                setWorkoutName('');
                setDuration('');
                setCalories('');
                setSets('');
                setReps('');
                setWeight('');
                setDistance('');
                setWorkoutDate(new Date().toISOString().split('T')[0]);
                setShowPresets(false);
            }, 1500);
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Failed to save workout');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 rounded-full text-sm font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/20 text-white"
            >
                <Plus size={16} /> Add New Workout
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto z-[100] w-full max-w-lg h-fit bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl text-white"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <Dumbbell className="text-orange-500" size={20} />
                                    </div>
                                    <h2 className="text-xl font-black uppercase italic tracking-tight">New Session</h2>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* --- UPDATED: Dynamic Status Message --- */}
                                <AnimatePresence mode="wait">
                                    {status === 'success' && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm bg-green-500/10 py-3 rounded-xl">
                                            <CheckCircle2 size={16} /> Workout saved successfully!
                                        </motion.div>
                                    )}
                                    {status === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm bg-red-500/10 py-3 rounded-xl">
                                            <AlertCircle size={16} /> {errorMessage || 'Something went wrong'}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Workout Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={workoutName}
                                            onChange={(e) => setWorkoutName(e.target.value)}
                                            onFocus={() => setShowPresets(true)}
                                            placeholder="e.g. Upper Body Push"
                                            className={`w-full bg-black border ${status === 'error' && !workoutName ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white transition-colors`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPresets(!showPresets)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <ChevronDown size={16} className={`text-zinc-500 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Preset Dropdown */}
                                    <AnimatePresence>
                                        {showPresets && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-10 w-[calc(100%-48px)] mt-1 bg-zinc-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                                            >
                                                <div className="p-2 border-b border-white/5">
                                                    <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest px-2">Quick Select</span>
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                    <div className="p-2">
                                                        <div className="text-[10px] uppercase font-black text-orange-500 tracking-widest px-2 py-1">Strength</div>
                                                        {WORKOUT_PRESETS.filter(p => p.type === 'strength').map((preset) => (
                                                            <button
                                                                key={preset.name}
                                                                type="button"
                                                                onClick={() => handleSelectPreset(preset)}
                                                                className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg transition-colors flex justify-between items-center group"
                                                            >
                                                                <span className="text-sm">{preset.name}</span>
                                                                <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
                                                                    {preset.sets}×{preset.reps} · ~{Math.round(30 * preset.caloriesPerMin)} kcal
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="p-2 border-t border-white/5">
                                                        <div className="text-[10px] uppercase font-black text-blue-500 tracking-widest px-2 py-1">Cardio</div>
                                                        {WORKOUT_PRESETS.filter(p => p.type === 'cardio').map((preset) => (
                                                            <button
                                                                key={preset.name}
                                                                type="button"
                                                                onClick={() => handleSelectPreset(preset)}
                                                                className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg transition-colors flex justify-between items-center group"
                                                            >
                                                                <span className="text-sm">{preset.name}</span>
                                                                <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
                                                                    {preset.duration}min · ~{Math.round((preset.duration || 30) * preset.caloriesPerMin)} kcal
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-2 border-t border-white/5 bg-zinc-900/50">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPresets(false)}
                                                        className="w-full text-center text-xs text-zinc-500 hover:text-white py-1"
                                                    >
                                                        Or type your own workout name above
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1 flex items-center gap-1">
                                            <Timer size={12} /> Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="Min"
                                            className={`w-full bg-black border ${status === 'error' && !duration ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white transition-colors`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1 flex items-center gap-1">
                                            <Calendar size={12} /> Date
                                        </label>
                                        <input
                                            type="date"
                                            value={workoutDate}
                                            onChange={(e) => setWorkoutDate(e.target.value)}
                                            className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1 flex items-center gap-1">
                                            <Flame size={12} /> Calories
                                        </label>
                                        <input
                                            type="text"
                                            value={calories}
                                            onChange={(e) => setCalories(e.target.value)}
                                            placeholder="kcal"
                                            className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white"
                                        />
                                    </div>
                                </div>

                                {/* --- NEW: Type Toggle & Detailed Metrics --- */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex bg-black/50 p-1 rounded-xl">
                                        <button
                                            onClick={() => setType('strength')}
                                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${type === 'strength' ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            Strength
                                        </button>
                                        <button
                                            onClick={() => setType('cardio')}
                                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${type === 'cardio' ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            Cardio
                                        </button>
                                    </div>

                                    {type === 'strength' ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Sets</label>
                                                <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="0" className="w-full bg-black border border-white/5 rounded-2xl px-4 py-3 text-white text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Reps</label>
                                                <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="0" className="w-full bg-black border border-white/5 rounded-2xl px-4 py-3 text-white text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Weight (kg)</label>
                                                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" className="w-full bg-black border border-white/5 rounded-2xl px-4 py-3 text-white text-sm" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Distance (km)</label>
                                            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="0.0" className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-zinc-800/30 border-t border-white/5 flex gap-3">
                                <button onClick={() => setIsOpen(false)} className="flex-1 py-4 text-sm font-bold text-zinc-400 hover:text-white">Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={status === 'success'}
                                    className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl text-sm font-black uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-white"
                                >
                                    {status === 'success' ? 'Saved' : 'Save Workout'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}