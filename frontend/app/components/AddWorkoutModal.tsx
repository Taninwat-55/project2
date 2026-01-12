'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Dumbbell, Timer, Flame, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AddWorkoutModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    // --- NEW: Form State ---
    const [workoutName, setWorkoutName] = useState('');
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');

    const handleSave = () => {
        // --- NEW: Validation Check ---
        if (!workoutName.trim() || !duration.trim()) {
            setStatus('error');
            // Reset error after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        // If validation passes
        setStatus('success');

        setTimeout(() => {
            setStatus('idle');
            setIsOpen(false);
            // Clear inputs after successful save
            setWorkoutName('');
            setDuration('');
            setCalories('');
        }, 2000);
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
                                            <AlertCircle size={16} /> Please fill in Name and Duration
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Workout Name</label>
                                    <input
                                        type="text"
                                        value={workoutName}
                                        onChange={(e) => setWorkoutName(e.target.value)}
                                        placeholder="e.g. Upper Body Push"
                                        className={`w-full bg-black border ${status === 'error' && !workoutName ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white transition-colors`}
                                    />
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