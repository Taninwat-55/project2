'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, RefreshCcw, Zap, Loader2, X } from 'lucide-react';
import { getRandomRecipes, logMeal } from "@/app/actions/nutrition";

// Definierar typerna för att TypeScript ska vara nöjd
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface RecommendedRecipe {
  id: number;
  title: string;
  image: string;
  nutrition?: {
    nutrients: { name: string; amount: number }[];
  };
}

export default function RecommendedFuel({ onLogSuccess }: { onLogSuccess: () => void }) {
  const [recipes, setRecipes] = useState<RecommendedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<RecommendedRecipe | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const fetchRecipes = async () => {
    setIsRefreshing(true);
    try {
      const data = await getRandomRecipes(3);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const confirmLogMeal = async (mealType: MealType) => {
    if (!activeRecipe) return;
    
    setIsLogging(true);
    const findNut = (name: string) => 
      activeRecipe.nutrition?.nutrients?.find(n => n.name === name)?.amount || 0;

    const result = await logMeal({
      name: activeRecipe.title,
      type: mealType,
      calories: Math.round(findNut("Calories") || 500),
      protein: Math.round(findNut("Protein") || 30),
      carbs: Math.round(findNut("Carbohydrates") || 55),
      fat: Math.round(findNut("Fat") || 15),
    });

    if (result.success) {
      onLogSuccess();
      setActiveRecipe(null);
    }
    setIsLogging(false);
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center border border-zinc-800/50 rounded-[2.5rem] bg-zinc-900/20">
      <Loader2 className="animate-spin text-orange-500" />
    </div>
  );

  return (
    <section className="mb-12 relative">
      {/* MEAL PICKER POPUP */}
      {activeRecipe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-black italic uppercase text-white leading-tight">
                Log to <span className="text-orange-500">Timeline</span>
              </h3>
              <button onClick={() => setActiveRecipe(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-zinc-400 text-xs mb-6 uppercase font-bold tracking-widest text-left leading-relaxed">
              Select category for: <br/>
              <span className="text-white italic">{activeRecipe.title}</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                <button
                  key={type}
                  disabled={isLogging}
                  onClick={() => confirmLogMeal(type)}
                  className="py-4 bg-black/40 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLogging ? (
                    <Loader2 className="animate-spin mx-auto" size={14} />
                  ) : (
                    type
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-end mb-6 text-left">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white font-sans">
            Recommended <span className="text-orange-500">Recipe</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Optimized meal suggestions for your goals
          </p>
        </div>
        <button 
          onClick={fetchRecipes}
          disabled={isRefreshing}
          className={`p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-orange-500 transition-all ${isRefreshing ? 'animate-spin opacity-50' : ''}`}
        >
          <RefreshCcw size={16} className="text-orange-500" />
        </button>
      </div>

      {/* RECIPE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="group relative bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800/50 overflow-hidden hover:border-orange-500/50 transition-all duration-500 shadow-xl flex flex-col h-full text-left">
            <div className="relative h-44 w-full overflow-hidden">
              <Image 
                src={recipe.image} 
                alt={recipe.title} 
                fill 
                className="object-cover group-hover:scale-105 transition duration-700 opacity-70" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1.5 text-white">
                <Zap size={10} className="text-orange-500 fill-orange-500" /> High Performance
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-sm mb-6 line-clamp-2 italic uppercase text-white tracking-tight">
                {recipe.title}
              </h3>
              
              <div className="mt-auto flex justify-between items-center gap-4">
                <button className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors">
                  View Blueprint
                </button>
                <button 
                  onClick={() => setActiveRecipe(recipe)}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-2xl transition active:scale-90 flex items-center gap-2 shadow-lg shadow-orange-900/20"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Log 1 Serving</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}