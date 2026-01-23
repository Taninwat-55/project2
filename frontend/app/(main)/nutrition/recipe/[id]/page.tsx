'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Utensils, Check, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getRecipeDetails } from "@/app/actions/recipes";
import { logMeal } from "@/app/actions/nutrition";

ChartJS.register(ArcElement, Tooltip, Legend);

// --- TYPES & INTERFACES ---
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

interface Ingredient {
  original: string;
}

interface Step {
  number: number;
  step: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  nutrition: {
    nutrients: Nutrient[];
  };
  extendedIngredients: Ingredient[];
  analyzedInstructions: {
    steps: Step[];
  }[];
}

export default function RecipeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<MealType>("lunch");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  useEffect(() => {
    params.then(p => {
      getRecipeDetails(p.id).then(data => setRecipe(data as Recipe));
    });
  }, [params]);

  if (!recipe) return (
    <div className="min-h-screen bg-black flex items-center justify-center italic font-black uppercase tracking-widest text-orange-500 animate-pulse">
      Initialising Nexus...
    </div>
  );

  const findNutrient = (name: string) => recipe.nutrition?.nutrients?.find((n) => n.name === name);
  const p = Math.round(findNutrient("Protein")?.amount || 0);
  const c = Math.round(findNutrient("Net Carbohydrates")?.amount || findNutrient("Carbohydrates")?.amount || 0);
  const f = Math.round(findNutrient("Fat")?.amount || 0);
  const kcal = Math.round(findNutrient("Calories")?.amount || 0);

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

  const handleLogRecipe = async () => {
    setLoading(true);
    const result = await logMeal({
      name: recipe.title,
      type: selectedType,
      calories: kcal,
      protein: p,
      carbs: c,
      fat: f,
    });
    setLoading(false);
    if (result.success) alert(`Logged to ${selectedType.toUpperCase()}!`);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <main className="max-w-6xl mx-auto p-8">
        
        <div className="flex justify-between items-center mb-10 text-left">
          <Link href="/nutrition/recipe" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition text-[10px] font-black uppercase tracking-[0.2em]">
            <ArrowLeft size={14} /> Back to Search
          </Link>
        </div>

        <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden mb-12 border border-zinc-800/50 shadow-2xl">
          <Image src={recipe.image} alt={recipe.title} fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 text-left">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-6 max-w-2xl">{recipe.title}</h1>
            <div className="flex gap-4 uppercase font-black text-[10px] tracking-widest">
              <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-2">
                <Clock size={16} className="text-orange-500" /> {recipe.readyInMinutes} MIN
              </div>
              <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-2">
                <Utensils size={16} className="text-orange-500" /> {recipe.servings} SERVINGS
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          
          <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800/50 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 px-1 italic">The Fuel Stack</h3>
            <div className="space-y-3">
              {recipe.extendedIngredients?.map((ing, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCheckedIngredients(prev => prev.includes(ing.original) ? prev.filter(i => i !== ing.original) : [...prev, ing.original])}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${checkedIngredients.includes(ing.original) ? 'bg-orange-500/5 border-orange-500/20 opacity-40' : 'bg-black/20 border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${checkedIngredients.includes(ing.original) ? 'bg-orange-500 border-orange-500' : 'border-zinc-700'}`}>
                    {checkedIngredients.includes(ing.original) && <Check size={12} strokeWidth={4} />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-zinc-300">{ing.original}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 text-left">
            <div className="bg-zinc-900/40 p-12 rounded-[3rem] border border-zinc-800/50 flex flex-col items-center justify-center relative shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 absolute top-10 italic">Performance Data</h3>
              
              <div className="relative w-56 h-56 my-8">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white italic tracking-tighter">{kcal}</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 italic">KCAL / TOTAL</span>
                </div>
              </div>

              <div className="w-full mb-8">
                <label className="text-[9px] font-black text-zinc-600 uppercase mb-4 block tracking-[0.3em] text-center">Assign to category</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${selectedType === type ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' : 'bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full space-y-2">
                {[
                  { label: "Protein", val: p, color: "text-blue-400" },
                  { label: "Carbs", val: c, color: "text-green-500" },
                  { label: "Fats", val: f, color: "text-yellow-600" }
                ].map((m) => (
                  <div key={m.label} className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                    <span className={m.color}>{m.label}</span>
                    <span>{m.val}G</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleLogRecipe}
                disabled={loading}
                className="w-full mt-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-orange-900/30"
              >
                {loading ? "PROCESSING..." : <><Plus size={18} /> Add to performance</>}
              </button>
            </div>
          </div>
        </div>

        <div className="text-left">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 px-4">The <span className="text-orange-500">Method</span></h2>
          <div className="space-y-6">
            {recipe.analyzedInstructions?.[0]?.steps.map((step) => (
              <div 
                key={step.number} 
                onClick={() => setCompletedSteps(prev => prev.includes(step.number) ? prev.filter(s => s !== step.number) : [...prev, step.number])}
                className={`p-10 rounded-[3rem] border transition-all cursor-pointer group flex gap-10 items-start ${completedSteps.includes(step.number) ? 'bg-zinc-900/20 border-zinc-900 opacity-40' : 'bg-zinc-900/40 border-zinc-800 hover:border-orange-500/50'}`}
              >
                <span className={`text-5xl font-black italic leading-none ${completedSteps.includes(step.number) ? 'text-zinc-800' : 'text-orange-500/20 group-hover:text-orange-500/40'}`}>
                  {step.number.toString().padStart(2, '0')}
                </span>
                <p className={`text-lg font-medium leading-relaxed flex-1 ${completedSteps.includes(step.number) ? 'text-zinc-600' : 'text-zinc-300'}`}>{step.step}</p>
                <div className={`mt-2 p-3 rounded-full border transition-all ${completedSteps.includes(step.number) ? 'bg-orange-600 border-orange-600 text-white' : 'border-zinc-800 text-transparent'}`}>
                  <Check size={20} strokeWidth={4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}