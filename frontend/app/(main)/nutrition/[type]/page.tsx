'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Utensils, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { deleteMealLog } from "@/app/actions/nutrition";
import EditMealModal from "@/app/components/EditMealModal";

// Typ för databasen
interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  created_at: string;
}

// Typ för redigerings-modalen (UI-format)
interface EditMealData {
  id: string;
  name: string;
  type: string;
  amount: string;
  kcal: number;
  p: string;
  c: string;
  f: string;
}

export default function MealTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params?.type as string;

  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States för redigering
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EditMealData | null>(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("meal_type", type?.toLowerCase())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fel vid hämtning:", error.message);
    } else {
      setMeals(data || []);
    }
    setLoading(false);
  }, [type]);

  useEffect(() => {
    if (type) fetchMeals();
  }, [type, fetchMeals]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const result = await deleteMealLog(id);
    if (result.success) {
      setMeals(prev => prev.filter(m => m.id !== id));
    } else {
      alert("Error: " + result.error);
    }
  };

  const handleEditClick = (meal: MealLog) => {
    // Omvandla till det format din modal förväntar sig
    const formattedItem: EditMealData = {
      id: meal.id,
      name: meal.name,
      type: meal.meal_type,
      amount: "1 unit",
      kcal: meal.calories,
      p: `${meal.protein_g}g`,
      c: `${meal.carbs_g}g`,
      f: `${meal.fat_g}g`,
    };
    setSelectedItem(formattedItem);
    setIsEditOpen(true);
  };

  const totals = meals.reduce((acc, meal) => ({
    kcal: acc.kcal + (meal.calories || 0),
    p: acc.p + (meal.protein_g || 0),
    c: acc.c + (meal.carbs_g || 0),
    f: acc.f + (meal.fat_g || 0),
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className="bg-black min-h-screen text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-4xl font-extrabold capitalize tracking-tight">
            {type} <span className="text-orange-500">History</span>
          </h1>
        </div>

        {/* Summeringskort */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Kcal", val: totals.kcal, color: "text-white" },
            { label: "Protein", val: `${totals.p}g`, color: "text-blue-400" },
            { label: "Carbs", val: `${totals.c}g`, color: "text-green-500" },
            { label: "Fats", val: `${totals.f}g`, color: "text-yellow-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50 text-center">
              <p className={`text-[10px] font-black uppercase mb-1 ${stat.color.replace('text-', 'text-opacity-50 text-')}`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Måltidslista */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 px-2">Logged Items</h2>
          
          {loading ? (
            <p className="text-zinc-500 text-center py-10 animate-pulse">Loading history...</p>
          ) : meals.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800 text-zinc-500 italic">
              No {type} items found for today.
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex justify-between items-center hover:bg-zinc-800/30 transition group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{meal.name}</h3>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                      {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right mr-2">
                    <div className="text-xl font-black italic">{meal.calories} <span className="text-[10px] not-italic text-orange-500 uppercase">kcal</span></div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                      P: {meal.protein_g}g • C: {meal.carbs_g}g • F: {meal.fat_g}g
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 border-l border-zinc-800 pl-6">
                    <button 
                      onClick={() => handleEditClick(meal)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(meal.id)}
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modalen som hanterar redigering */}
      <EditMealModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        itemData={selectedItem} 
      />
    </div>
  );
}