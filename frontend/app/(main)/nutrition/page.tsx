'use client';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Plus,
  Droplet,
  Flame,
  Clock,
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function NutritionTemplate() {
  // Shared Chart Options
  const macroOptions = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%',
  };

  // Helper to generate chart data
  const createMacroData = (current: number, goal: number, color: string) => ({
    datasets: [
      {
        data: [current, Math.max(0, goal - current)],
        backgroundColor: [color, '#18181b'],
        borderWidth: 0,
        borderRadius: 20,
        circumference: 360,
      },
    ],
  });

  const macroCards = [
    {
      label: 'Daily Calories',
      val: 1840,
      goal: 2500,
      unit: 'kcal',
      color: '#f97316',
      footerLabel: 'Remaining',
      footerVal: '660',
    },
    {
      label: 'Protein',
      val: 125,
      goal: 180,
      unit: 'g',
      color: '#206A9E',
      footerLabel: 'Status',
      footerVal: 'High',
    },
    {
      label: 'Carbs',
      val: 210,
      goal: 250,
      unit: 'g',
      color: '#51A255',
      footerLabel: 'Target',
      footerVal: 'Near',
    },
    {
      label: 'Fats',
      val: 45,
      goal: 65,
      unit: 'g',
      color: '#C7831F',
      footerLabel: 'Balance',
      footerVal: 'Good',
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30">
      <main className="max-w-6xl mx-auto p-8">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
            Your <span className="text-orange-500">Nutrition</span>
          </h1>
          <p className="text-zinc-500">
            Track your progress and push your limits.
          </p>
        </div>

        {/* Unified Macro Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {macroCards.map((m) => (
            <div
              key={m.label}
              className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center"
            >
              {/* Card Header */}
              <div className="flex items-center gap-2 self-start mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {m.label}
                </h2>
              </div>

              {/* Central Large Chart (Weekly Goals Style) */}
              <div className="relative w-36 h-36 mb-8">
                <Doughnut
                  data={createMacroData(m.val, m.goal, m.color)}
                  options={macroOptions}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">
                    {Math.round((m.val / m.goal) * 100)}%
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {m.val}
                    {m.unit}
                  </span>
                </div>
              </div>

              {/* Bottom List Details */}
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                  <span className="text-zinc-500">Goal</span>
                  <span>
                    {m.goal} {m.unit}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold border-t border-zinc-800/50 pt-3">
                  <span className="text-zinc-500">{m.footerLabel}</span>
                  <span style={{ color: m.color }}>
                    {m.footerVal} {m.unit === 'kcal' ? 'kcal' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Up & Weekly Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Next Up</h2>
              <Link
                href="#"
                className="text-orange-500 text-sm font-bold hover:underline"
              >
                View Full Plan
              </Link>
            </div>
            <div className="bg-black/40 p-8 rounded-3xl border border-zinc-800/50">
              <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest mb-6">
                <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full">
                  Suggestion • LUNCH
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <Clock className="w-3 h-3" /> 20 MIN
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <Flame className="w-3 h-3" /> 580 KCAL
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-3">Grilled Salmon Bowl</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-md">
                Rich in omega-3 fatty acids and high quality protein. Includes
                quinoa, avocado, and steamed broccoli.
              </p>
              <div className="flex gap-4">
                <button className="bg-orange-600 px-8 py-3 rounded-2xl font-bold text-sm transition-transform active:scale-95">
                  Log Meal
                </button>
                <button className="bg-zinc-800 px-8 py-3 rounded-2xl font-bold text-sm border border-zinc-700 transition">
                  Recipe
                </button>
              </div>
            </div>
          </div>

          {/* Weekly Goals with Chart.js */}
          <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center">
            <h2 className="text-xl font-bold self-start mb-10">Weekly Goals</h2>
            <div className="relative w-44 h-44 mb-8">
              <Doughnut
                data={createMacroData(82, 100, '#f97316')}
                options={macroOptions}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">82%</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  On Track
                </span>
              </div>
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Perfect Days</span>
                <span className="font-bold">4 Days</span>
              </div>
              <div className="flex justify-between text-sm border-t border-zinc-800 pt-4">
                <span className="text-zinc-500">Cheat Meals</span>
                <span className="font-bold">1 Meal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Log & Meal Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Today&apos;s Log</h2>
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white text-base mr-1">1,840</span> kcal
                consumed
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: '🥐',
                  name: 'Breakfast',
                  desc: 'Oatmeal & Berries • 450 kcal',
                },
                {
                  icon: '🍲',
                  name: 'Lunch',
                  desc: 'Recommended: 600 - 800 kcal',
                },
                {
                  icon: '🥗',
                  name: 'Dinner',
                  desc: 'Recommended: 500 - 700 kcal',
                },
                {
                  icon: '🍎',
                  name: 'Snack',
                  desc: '270 kcal • Green Smoothie',
                },
              ].map((meal) => (
                <div
                  key={meal.name}
                  className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-zinc-800 hover:bg-zinc-800/40 transition group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition">
                      {meal.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{meal.name}</h4>
                      <p className="text-zinc-500 text-xs">{meal.desc}</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                    <Plus className="w-5 h-5 text-zinc-400 hover:text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col">
            <h2 className="text-xl font-bold mb-8">Meal Templates</h2>
            <div className="space-y-4 mb-6">
              {[
                { name: 'High Protein Day', desc: '220g Protein • 2400 kcal' },
                { name: 'Rest Day Low Carb', desc: '50g Carbs • 1800 kcal' },
              ].map((t) => (
                <div
                  key={t.name}
                  className="p-5 bg-black/40 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition cursor-pointer"
                >
                  <div className="font-bold">{t.name}</div>
                  <div className="text-zinc-500 text-xs mt-1 uppercase tracking-tighter">
                    {t.desc}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-zinc-800/50 border border-zinc-800 border-dashed rounded-2xl text-zinc-500 font-bold hover:text-white transition mt-auto">
              + Create Template
            </button>
          </div>
        </div>

        {/* Hydration Status */}
        <div className="bg-gradient-to-br from-[#E65015] to-[#BC4315] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-orange-900/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-grow">
              <h2 className="text-4xl font-black mb-1">Hydration Status</h2>
              <p className="text-orange-100/80 mb-8 font-medium">
                Keep it up! Proper hydration aids muscle recovery.
              </p>
              <div className="h-3 w-full bg-orange-800/40 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-orange-200">
                <span>2.5L Daily Goal</span>
                <span className="text-4xl italic text-white">65%</span>
              </div>
            </div>
            <div className="flex gap-4">
              {[250, 500].map((amt) => (
                <button
                  key={amt}
                  className="bg-white/10 hover:bg-white/20 p-6 rounded-3xl flex flex-col items-center gap-2 backdrop-blur-md border border-white/10 transition active:scale-95"
                >
                  <Droplet className="w-6 h-6" />
                  <span className="text-[10px] font-black">+{amt}ml</span>
                </button>
              ))}
            </div>
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
              <span className="font-bold text-lg tracking-wide text-[var(--foreground)]">
                Nexus
              </span>
            </Link>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
              Empowering athletes everywhere to reach their peak performance
              through data and discipline.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[var(--foreground)] mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--foreground)] mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--foreground)] mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Status
                </Link>
              </li>
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
