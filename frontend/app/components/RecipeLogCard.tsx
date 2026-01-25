'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { logMeal } from "@/app/actions/nutrition";

ChartJS.register(ArcElement, Tooltip, Legend);

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface RecipeLogCardProps {
  title: string;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  recipeServings: number;
}

export default function RecipeLogCard({ 
  title, totalKcal, totalProtein, totalCarbs, totalFat, recipeServings 
}: RecipeLogCardProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<MealType>("lunch");
  const [userServings, setUserServings] = useState<number>(1);

  const kcal = Math.round((totalKcal / recipeServings) * userServings);
  const p = Math.round((totalProtein / recipeServings) * userServings);
  const c = Math.round((totalCarbs / recipeServings) * userServings);
  const f = Math.round((totalFat / recipeServings) * userServings);

  const chartData = {
    datasets: [{
      data: [p || 1, c || 1, f || 1],
      backgroundColor: ['#206A9E', '#51A255', '#C7831F'],
      borderWidth: 0,
      borderRadius: 20,
      circumference: 360,
    }],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%',
  };

  const handleLog = async () => {
    setLoading(true);
    const result = await logMeal({
      name: `${title} (${userServings} portions)`,
      type: selectedType,
      calories: kcal,
      protein: p,
      carbs: c,
      fat: f,
    });
    setLoading(false);
    if (result.success) alert(`Logged to ${selectedType}!`);
  };

  return (
    <div className="bg-zinc-900/40 p-12 rounded-[3rem] border border-zinc-800/50 flex flex-col items-center justify-center relative shadow-2xl h-full">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 absolute top-10 italic">Performance Data</h3>
      
      <div className="relative w-56 h-56 my-8">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-white italic tracking-tighter leading-none">{kcal}</span>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 italic text-center">KCAL LOGGED</span>
        </div>
      </div>

      <div className="w-full mb-6 bg-black/40 p-6 rounded-[2rem] border border-zinc-800/50 text-center">
        <label className="text-[9px] font-black text-zinc-500 uppercase mb-4 block tracking-[0.3em]">Portions Consumed</label>
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setUserServings(Math.max(0.5, userServings - 0.5))} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-orange-600 transition"><Minus size={16} /></button>
          <span className="text-4xl font-black italic tracking-tighter w-16 text-orange-500">{userServings}</span>
          <button onClick={() => setUserServings(userServings + 0.5)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-orange-600 transition"><Plus size={16} /></button>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="grid grid-cols-2 gap-2">
          {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((type) => (
            <button key={type} onClick={() => setSelectedType(type)} className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${selectedType === type ? 'bg-orange-600 border-orange-500 text-white' : 'bg-black/20 border-zinc-800 text-zinc-500'}`}>{type}</button>
          ))}
        </div>
      </div>

      <div className="w-full space-y-2">
        {[{ label: "Protein", val: p, color: "text-blue-400" }, { label: "Carbs", val: c, color: "text-green-500" }, { label: "Fats", val: f, color: "text-yellow-600" }].map((m) => (
          <div key={m.label} className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
            <span className={m.color}>{m.label}</span>
            <span>{m.val}G</span>
          </div>
        ))}
      </div>

      <button onClick={handleLog} disabled={loading} className="w-full mt-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50">
        {loading ? "PROCESSING..." : <><Plus size={18} /> Add to performance</>}
      </button>
    </div>
  );
}