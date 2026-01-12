'use client';

import React, { useState } from 'react';
import { Play, MoreVertical, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Updated Interface to match your Database/Server Action fields
interface WorkoutItem {
    title: string;
    duration: string;
    type: string;
    image: string;
    videoId: string;    // Matches your new Supabase column
    description: string; // Matches your new Supabase column
}

export default function LibraryItem({ item }: { item: WorkoutItem }) {
    const [activeModal, setActiveModal] = useState<'video' | 'info' | null>(null);

    return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-orange-500/30">
            {/* Image */}
            <div
                className="w-20 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url('${item.image}')` }}
            />
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{item.title}</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                    {item.duration} · {item.type}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setActiveModal('video')}
                    className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
                >
                    <Play size={16} className="ml-0.5" />
                </button>
                <button 
                    onClick={() => setActiveModal('info')}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
                >
                    <MoreVertical size={16} />
                </button>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {activeModal === 'video' && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setActiveModal(null)} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }} 
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <iframe 
                                className="w-full h-full" 
                                src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`} 
                                allow="autoplay; encrypted-media" 
                                allowFullScreen 
                            />
                            <button 
                                onClick={() => setActiveModal(null)} 
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-orange-500 transition-colors"
                            >
                                <X size={20}/>
                            </button>
                        </motion.div>
                    </div>
                )}

                {activeModal === 'info' && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setActiveModal(null)} 
                            className="absolute inset-0 bg-black/60" 
                        />
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            exit={{ y: 20, opacity: 0 }} 
                            className="relative w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-[32px] text-white"
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="text-orange-500" /> Details
                            </h3>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                {item.description || "No additional details provided for this workout."}
                            </p>
                            
                            {/* Orange Close Button with Hover State */}
                            <button 
                                onClick={() => setActiveModal(null)} 
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}