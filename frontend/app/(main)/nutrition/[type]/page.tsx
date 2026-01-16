'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Utensils, Flame, Droplet } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client"; // Se till att sökvägen stämmer

interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export default function MealTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string; // t.ex. "lunch"
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      const supabase = createClient();
      
      // Hämta måltider för just denna typ (frukost, lunch etc)
      const { data, error } = await supabase
        .from("meal_logs") // Se till att tabellnamnet matchar Supabase
        .select("*")
        .eq("type", type.toLowerCase())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching meals:", error);
      } else {
        setMeals(data || []);
      }
      setLoading(false);
    };

    fetchMeals();
  }, [type]);

  // Räkna ut totalen för dagen på denna sida
  const totals = meals.reduce((acc, meal) => ({
    kcal: acc.kcal + (meal.calories || 0),
    p: acc.p + (meal.protein || 0),
    c: acc.c + (meal.carbs || 0),
    f: acc.f + (meal.fat || 0),
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header med tillbaka-knapp */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-4xl font-extrabold capitalize">
            {type} <span className="text-orange-500">History</span>
          </h1>
        </div>

        {/* Summering för kategorin */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Total Kcal</p>
            <p className="text-2xl font-bold text-center">{totals.kcal}</p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Protein</p>
            <p className="text-2xl font-bold text-center">{totals.p}g</p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50">
            <p className="text-green-500 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Carbs</p>
            <p className="text-2xl font-bold text-center">{totals.c}g</p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50">
            <p className="text-yellow-600 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Fats</p>
            <p className="text-2xl font-bold text-center">{totals.f}g</p>
          </div>
        </div>

        {/* Lista på måltider */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-zinc-500 text-center py-10">Loading your meals...</p>
          ) : meals.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800">
              <p className="text-zinc-500">No {type} logged for today yet.</p>
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center group hover:border-orange-500/50 transition">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-orange-500">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{meal.name}</h3>
                    <p className="text-zinc-500 text-sm italic">
                        {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black">{meal.calories} kcal</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                    P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}