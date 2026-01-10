'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  UtensilsCrossed, 
  Calendar, 
  ChevronRight,
  History as HistoryIcon,
  Flame,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const MOCK_DATA = [
  { 
    id: 1, 
    type: 'workout', 
    name: 'Leg Day Extreme', 
    date: 'Today, 14:20', 
    detail: '65 min • 420 kcal', 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    moreInfo: {
      exercises: ['Squats: 4x10', 'Leg Press: 3x12', 'Leg Extensions: 3x15'],
      intensity: 'High',
    }
  },
  { 
    id: 2, 
    type: 'meal', 
    name: 'Protein Smoothie', 
    date: 'Today, 08:30', 
    detail: 'Breakfast • 320 kcal', 
    color: 'text-green-500', 
    bg: 'bg-green-500/10',
    moreInfo: {
      macros: { p: '30g', c: '45g', f: '8g' },
    }
  },
  { 
    id: 3, 
    type: 'workout', 
    name: 'Evening Run', 
    date: 'Yesterday, 18:45', 
    detail: '5.2 km • 28 min', 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    moreInfo: {
      exercises: ['Running: 5.2km', 'Stretching: 10 min'],
      intensity: 'Medium',
    }
  }
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'workout' | 'meal'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredItems = MOCK_DATA.filter(item => 
    activeTab === 'all' ? true : item.type === activeTab
  );

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
              <h1 className="text-4xl font-black tracking-tight uppercase text-white">History</h1>
              <p className="text-zinc-500 font-medium">Tracking your evolution.</p>
            </div>
          </motion.div>

          {/* Filter Picker */}
          <div className="flex p-1.5 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-[28px] mb-10 w-fit">
            {(['all', 'workout', 'meal'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setExpandedId(null); }}
                className={`relative px-6 py-2.5 text-sm font-bold capitalize transition-colors duration-300 ${
                  activeTab === tab ? 'text-black' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {activeTab === tab && (
                  <motion.div layoutId="pill" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", bounce: 0.4, duration: 0.6 }} />
                )}
                <span className="relative z-10">{tab === 'all' ? 'All' : tab === 'workout' ? 'Workouts' : 'Meals'}</span>
              </button>
            ))}
          </div>

          {/* History List */}
          <div className="flex flex-col gap-4 mb-12">
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className={`group bg-zinc-900/40 border border-white/10 rounded-[24px] cursor-pointer overflow-hidden transition-all ${expandedId === item.id ? 'ring-1 ring-orange-500' : ''}`}
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                      {item.type === 'workout' ? <Dumbbell size={20} /> : <UtensilsCrossed size={20} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                        <Calendar size={10} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: expandedId === item.id ? 90 : 0 }}>
                      <ChevronRight size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
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
                                   <Zap size={10} /> Sets
                                 </p>
                                 <div className="text-xs font-bold">{item.moreInfo.exercises?.join(', ')}</div>
                               </div>
                               <div className="col-span-1 bg-white/5 p-3 rounded-xl">
                                 <p className="text-zinc-500 text-[9px] uppercase font-black mb-1 flex items-center gap-1">
                                   <Flame size={10} /> Intensity
                                 </p>
                                 <div className="text-xs font-bold text-orange-500 italic">High Level</div>
                               </div>
                             </>
                           ) : (
                            <div className="col-span-2 bg-white/5 p-3 rounded-xl flex justify-around text-center">
                              <div><p className="text-[9px] text-zinc-500 uppercase font-black">Prot</p><p className="font-bold">{item.moreInfo.macros?.p}</p></div>
                              <div><p className="text-[9px] text-zinc-500 uppercase font-black">Carb</p><p className="font-bold">{item.moreInfo.macros?.c}</p></div>
                              <div><p className="text-[9px] text-zinc-500 uppercase font-black">Fat</p><p className="font-bold">{item.moreInfo.macros?.f}</p></div>
                            </div>
                           )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* LEAD MAGNET SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 rounded-[32px] p-8"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-black/80">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Premium Insight</span>
              </div>
              <h2 className="text-2xl font-black text-black leading-tight mb-4 uppercase italic">
                Get Your Weekly <br />AI Performance Report
              </h2>
              <p className="text-black/70 text-sm font-medium mb-6 max-w-[280px]">
                We&apos;ve analyzed your last 3 workouts. You&apos;re 12% stronger than last week!
              </p>
              <button className="group flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:bg-zinc-900 active:scale-95">
                Download Analysis
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Visual Sidebar */}
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
              <p className="text-xs font-black tracking-widest uppercase italic text-white/90">System: Performance Optimized</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}