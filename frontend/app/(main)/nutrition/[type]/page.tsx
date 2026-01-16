'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Utensils } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Vi använder din befintliga klient!

interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein_g: number; // Ändrat för att matcha din nutrition.ts
  carbs_g: number;    // Ändrat
  fat_g: number;      // Ändrat
  meal_type: string;  // Ändrat från 'type' till 'meal_type'
  created_at: string;
}

export default function MealTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params?.type as string; 
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      // Vi skapar klienten här inne
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("meal_logs") 
        .select("*")
        .eq("meal_type", type?.toLowerCase()) // Matchar 'meal_type' i din nutrition.ts
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fel vid hämtning:", error.message);
      } else {
        setMeals(data || []);
      }
      setLoading(false);
    };

    if (type) fetchMeals();
  }, [type]);

  // Beräkna totaler (använder de uppdaterade namnen protein_g osv)
  const totals = meals.reduce((acc, meal) => ({
    kcal: acc.kcal + (meal.calories || 0),
    p: acc.p + (meal.protein_g || 0),
    c: acc.c + (meal.carbs_g || 0),
    f: acc.f + (meal.fat_g || 0),
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-4xl font-extrabold capitalize">
            {type} <span className="text-orange-500">History</span>
          </h1>
        </div>

        {/* Summeringskort */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 text-center">
            <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Total Kcal</p>
            <p className="text-2xl font-bold">{totals.kcal}</p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 text-center">
            <p className="text-blue-400 text-[10px] font-black uppercase mb-1">Protein</p>
            <p className="text-2xl font-bold">{totals.p}g</p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 text-center">
            <p className="text-green-500 text-[10px] font-black uppercase mb-1">Carbs</p>
            <p className="text-2xl font-bold">{totals.c}g</p>
          </div>
          <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 text-center">
            <p className="text-yellow-600 text-[10px] font-black uppercase mb-1">Fats</p>
            <p className="text-2xl font-bold">{totals.f}g</p>
          </div>
        </div>

        {/* Måltidslista */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-zinc-500 text-center py-10">Loading...</p>
          ) : meals.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800 text-zinc-500">
              No {type} items found.
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-orange-500">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{meal.name}</h3>
                    <p className="text-zinc-500 text-sm">
                      {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black">{meal.calories} kcal</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">
                    P: {meal.protein_g}g • C: {meal.carbs_g}g • F: {meal.fat_g}g
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