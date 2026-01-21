'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useMemo } from 'react'; // Added useMemo for performance
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  UtensilsCrossed,
  Calendar,
  ChevronRight,
  ChevronLeft, // Added for pagination
  History as HistoryIcon,
  Flame,
  Zap,
  ArrowRight,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { HistoryItem } from '@/app/actions/history';

interface HistoryContentProps {
  initialItems: HistoryItem[];
}

export default function HistoryContent({ initialItems }: HistoryContentProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'workout' | 'meal'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Filter items first
  const filteredItems = initialItems.filter((item) =>
    activeTab === 'all' ? true : item.type === activeTab
  );

  // 2. Calculate pagination values
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle Tab Change
  const handleTabChange = (tab: 'all' | 'workout' | 'meal') => {
    setActiveTab(tab);
    setExpandedId(null);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Inside your component function:
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    // Simulate a download delay
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);

      // Hide the message after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT COLUMN: History & Lead Magnet */}
        <div className="px-6 pt-32 pb-20 max-w-2xl lg:ml-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="p-3 bg-zinc-900 rounded-2xl border border-white/10">
              <HistoryIcon className="text-orange-500" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase text-white">
                History
              </h1>
              <p className="text-zinc-500 font-medium">
                Tracking your evolution.
              </p>
            </div>
          </motion.div>

          {/* Filter Picker */}
          <div className="flex p-1.5 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-[28px] mb-10 w-fit">
            {(['all', 'workout', 'meal'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative px-6 py-2.5 text-sm font-bold capitalize transition-colors duration-300 ${
                  activeTab === tab
                    ? 'text-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 bg-white rounded-full"
                    transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'all'
                    ? 'All'
                    : tab === 'workout'
                    ? 'Workouts'
                    : 'Meals'}
                </span>
              </button>
            ))}
          </div>

          {/* History List */}
          <div className="flex flex-col gap-4 mb-8">
            {currentItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center bg-zinc-900/40 border border-white/5 rounded-[24px]"
              >
                <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
                  <ClipboardList className="text-zinc-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No History Yet
                </h3>
                <p className="text-zinc-500 text-sm max-w-[200px]">
                  Start logging to see your timeline.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {currentItems.map((item) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group bg-zinc-900/40 border border-white/10 rounded-[24px] cursor-pointer overflow-hidden transition-all ${
                      expandedId === item.id ? 'ring-1 ring-orange-500' : ''
                    }`}
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}
                      >
                        {item.type === 'workout' ? (
                          <Dumbbell size={20} />
                        ) : (
                          <UtensilsCrossed size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                          <Calendar size={10} />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedId === item.id ? 90 : 0 }}
                      >
                        <ChevronRight
                          size={18}
                          className="text-zinc-600 group-hover:text-white transition-colors"
                        />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {expandedId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 border-t border-white/5"
                        >
                          <div className="pt-4 grid grid-cols-2 gap-3">
                            {item.type === 'workout' ? (
                              <>
                                <div className="col-span-1 bg-white/5 p-3 rounded-xl">
                                  <p className="text-zinc-500 text-[9px] uppercase font-black mb-1 flex items-center gap-1">
                                    <Zap size={10} /> Details
                                  </p>
                                  <div className="text-xs font-bold">
                                    {item.detail}
                                  </div>
                                </div>
                                <div className="col-span-1 bg-white/5 p-3 rounded-xl">
                                  <p className="text-zinc-500 text-[9px] uppercase font-black mb-1 flex items-center gap-1">
                                    <Flame size={10} /> Intensity
                                  </p>
                                  <div className="text-xs font-bold text-orange-500 italic">
                                    High Level
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="col-span-2 bg-white/5 p-3 rounded-xl flex justify-around text-center">
                                <div>
                                  <p className="text-[9px] text-zinc-500 uppercase font-black">
                                    Prot
                                  </p>
                                  <p className="font-bold">
                                    {item.moreInfo.macros?.p}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-zinc-500 uppercase font-black">
                                    Carb
                                  </p>
                                  <p className="font-bold">
                                    {item.moreInfo.macros?.c}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-zinc-500 uppercase font-black">
                                    Fat
                                  </p>
                                  <p className="font-bold">
                                    {item.moreInfo.macros?.f}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-zinc-900 border border-white/5 disabled:opacity-30 transition-all hover:bg-zinc-800"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all border ${
                      currentPage === i + 1
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-zinc-900 border border-white/5 disabled:opacity-30 transition-all hover:bg-zinc-800"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* LEAD MAGNET SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 rounded-[32px] p-8"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-black/80">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Premium Insight
                </span>
              </div>
              <h2 className="text-2xl font-black text-black leading-tight mb-4 uppercase italic">
                Get Your Weekly <br />
                AI Performance Report
              </h2>
              <p className="text-black/70 text-sm font-medium mb-6 max-w-[280px]">
                We&apos;ve analyzed your progress. You&apos;re 12% stronger!
              </p>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="group relative flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:bg-zinc-900 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {isDownloading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                      }}
                    >
                      <Zap size={16} className="text-orange-500" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    Download Analysis
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}

                {/* Progress bar effect while downloading */}
                {isDownloading && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 1.5 }}
                    className="absolute bottom-0 left-0 h-[2px] bg-orange-500 w-full"
                  />
                )}
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden lg:block sticky top-0 h-screen overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10 w-full" />
          <Image
            src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Workout Performance"
            fill
            className="object-cover grayscale-[40%] brightness-[0.6]"
            priority
          />
          <div className="absolute bottom-12 left-12 z-20">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <p className="text-xs font-black tracking-widest uppercase italic text-white/90">
                System: Performance Optimized
              </p>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-0 left-1/2 z-50 flex items-center gap-3 bg-zinc-900 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl"
          >
            <div className="bg-orange-500/20 p-1.5 rounded-full">
              <Sparkles className="text-orange-500" size={16} />
            </div>
            <p className="text-sm font-bold text-white">
              Report downloaded successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
