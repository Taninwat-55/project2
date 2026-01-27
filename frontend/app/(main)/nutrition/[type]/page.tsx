'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Pencil, ChevronLeft, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { getTodayMeals, deleteMealLog } from '@/app/actions/nutrition';
import EditMealModal from '@/app/components/EditMealModal';
import QuickAddModal from '@/app/components/QuickAddModal';

// Registrera Chart.js-komponenter för att kunna rita Doughnut-diagrammen
ChartJS.register(ArcElement, Tooltip, Legend);

interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
}

// Definierar giltiga måltidstyper för att matcha URL-parametrar
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function MealTypePage() {
  const params = useParams();
  // Hämtar typen (t.ex. 'breakfast') direkt från URL:en /nutrition/breakfast
  const mealType = params.type as MealType;

  // --- STATES ---
  const [loggedItems, setLoggedItems] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    kcal: number;
    p: string;
    c: string;
    f: string;
  } | null>(null);

  // Hårdkodade mål (dessa kan i framtiden hämtas från en användarprofil)
  const mealGoal = 1000;
  const macroGoals = { p: 150, c: 200, f: 55 };

  // --- DATAHÄMTNING ---
  // Hämtar alla måltider men filtrerar dem baserat på den aktuella sidans typ
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const allMeals = await getTodayMeals();
      const filtered = (allMeals as MealLog[]).filter(
        (m) => m.meal_type === mealType,
      );
      setLoggedItems(filtered);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [mealType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- RADERING ---
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const result = await deleteMealLog(id);
    if (result.success) {
      setLoggedItems((prev) => prev.filter((item) => item.id !== id));
      setIsEditOpen(false);
    }
  };

  // --- BERÄKNINGAR ---
  // Summerar alla makronutrienter för de filtrerade måltiderna
  const totals = loggedItems.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.calories,
      p: acc.p + item.protein_g,
      c: acc.c + item.carbs_g,
      f: acc.f + item.fat_g,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  // --- CHART KONFIGURATION ---
  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%', // Gör cirkeln tunn för en modern look
  };

  // Funktion för att skapa data till cirkeldiagrammen (Nutrient vs Goal)
  const createMacroData = (current: number, target: number, color: string) => ({
    datasets: [
      {
        data: [current, Math.max(0, target - current)],
        backgroundColor: [color, '#18181b'], // Färg för framsteg vs mörk bakgrund
        borderWidth: 0,
        borderRadius: 20,
      },
    ],
  });

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30 pb-20">
      <main className="max-w-6xl mx-auto p-8">
        {/* HEADER & QUICK ADD */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-left">
            <Link
              href="/nutrition"
              className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 text-[10px] font-bold uppercase tracking-widest transition"
            >
              <ChevronLeft size={16} /> Back
            </Link>
            <h1 className="text-5xl font-extrabold mb-2 tracking-tight capitalize">
              {mealType} <span className="text-orange-500">Details</span>
            </h1>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black uppercase italic text-sm hover:bg-orange-500 transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Quick Add
          </button>
        </div>

        {/* STATS GRID: Fyra cirkeldiagram för kalorier och makron */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Calories',
              val: totals.kcal,
              goal: mealGoal,
              unit: 'kcal',
              color: '#f97316',
            },
            {
              label: 'Protein',
              val: totals.p,
              goal: macroGoals.p,
              unit: 'g',
              color: '#206A9E',
            },
            {
              label: 'Carbs',
              val: totals.c,
              goal: macroGoals.c,
              unit: 'g',
              color: '#51A255',
            },
            {
              label: 'Fats',
              val: totals.f,
              goal: macroGoals.f,
              unit: 'g',
              color: '#C7831F',
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 self-start mb-8">
                {m.label}
              </h2>
              <div className="relative w-36 h-36 mb-8">
                <Doughnut
                  data={createMacroData(m.val, m.goal, m.color)}
                  options={chartOptions}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">
                    {Math.round((m.val / (m.goal || 1)) * 100)}%
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase mt-1">
                    {m.val}
                    {m.unit}
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-between text-[11px] font-bold uppercase border-t border-zinc-800/50 pt-3">
                <span className="text-zinc-500">Goal</span>
                <span className="text-white">
                  {m.goal}
                  {m.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PROGRESS BAR: Visuell överblick för kaloriintaget för just denna måltidstyp */}
        <div className="bg-gradient-to-br from-[#E65015] to-[#BC4315] rounded-[2.5rem] p-10 mb-12 shadow-2xl shadow-orange-900/20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 text-left">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                {mealType} Goal
              </h2>
              <p className="text-orange-100/70 mt-2 font-medium">
                Remaining: {Math.max(0, mealGoal - totals.kcal)} kcal
              </p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-white italic tracking-tighter">
                {totals.kcal} / {mealGoal} kcal
              </span>
            </div>
          </div>
          <div className="h-5 w-full bg-orange-950/30 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              style={{
                width: `${Math.min(100, (totals.kcal / mealGoal) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* LISTA ÖVER LOGGADE OBJEKT: Visar varje matvara som lagts till */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold mb-6 px-2">Logged Items</h2>
          {loading ? (
            <p className="text-zinc-500 px-2 uppercase text-xs font-bold animate-pulse">
              Loading meals...
            </p>
          ) : loggedItems.length === 0 ? (
            <p className="text-zinc-500 px-2 uppercase text-xs font-bold">
              No meals logged for this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loggedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-xl leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1 block">
                        Consumed
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black block leading-none">
                        {item.calories}
                      </span>
                      <span className="text-[9px] font-bold text-orange-500 uppercase">
                        kcal
                      </span>
                    </div>
                  </div>

                  {/* Små makro-etiketter för varje enskild vara */}
                  <div className="flex justify-center gap-6 border-t border-zinc-800/50 pt-4 mb-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">
                        Protein
                      </span>
                      <span className="text-blue-400 font-bold text-sm">
                        {item.protein_g}g
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">
                        Carbs
                      </span>
                      <span className="text-green-500 font-bold text-sm">
                        {item.carbs_g}g
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">
                        Fats
                      </span>
                      <span className="text-yellow-600 font-bold text-sm">
                        {item.fat_g}g
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem({
                          id: item.id,
                          name: item.name,
                          kcal: item.calories,
                          p: `${item.protein_g}g`,
                          c: `${item.carbs_g}g`,
                          f: `${item.fat_g}g`,
                        });
                        setIsEditOpen(true);
                      }}
                      className="flex-1 py-3 bg-zinc-800 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-1 hover:bg-zinc-700 transition"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-3 bg-zinc-800 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-950/20 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODALER FÖR MODIFIERING OCH SNABB-TILLÄGG */}
      <EditMealModal
        key={selectedItem?.id || 'empty'}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onDelete={handleDelete}
        onUpdate={fetchData} // Uppdaterar listan direkt efter redigering
        itemData={selectedItem}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAdded={fetchData} // Uppdaterar listan direkt efter tillägg
        mealType={mealType}
      />
    </div>
  );
}
