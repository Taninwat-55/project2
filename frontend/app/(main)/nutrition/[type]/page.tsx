"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Trash2, Pencil, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getTodayMeals, deleteMealLog } from "@/app/actions/nutrition";
import EditMealModal from "@/app/components/EditMealModal";

interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  created_at?: string;
}

export default function MealTypePage() {
  const params = useParams();
  const mealType = params.type as string;

  const [loggedItems, setLoggedItems] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    kcal: number;
    p: string;
    c: string;
    f: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const allMeals = await getTodayMeals();
      // Här mappar vi om datan så TS vet att det är MealLog[]
      const filtered = (allMeals as MealLog[]).filter(
        (m) => m.meal_type === mealType,
      );
      setLoggedItems(filtered);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, [mealType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const result = await deleteMealLog(id);
    if (result.success) {
      setLoggedItems((prev) => prev.filter((item) => item.id !== id));
      setIsEditOpen(false);
    } else {
      alert("Error deleting: " + result.error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <main className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link
            href="/nutrition"
            className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 text-xs font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back
          </Link>
          <h1 className="text-5xl font-extrabold capitalize">
            {mealType} <span className="text-orange-500">Log</span>
          </h1>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-zinc-500 italic text-sm">Loading items...</p>
          ) : loggedItems.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-zinc-800 rounded-[2.5rem] text-center text-zinc-500">
              No items logged for {mealType} today.
            </div>
          ) : (
            loggedItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <div className="flex gap-4 mt-2 text-xs font-bold uppercase tracking-tighter">
                    <span className="text-blue-400">P: {item.protein_g}g</span>
                    <span className="text-green-500">C: {item.carbs_g}g</span>
                    <span className="text-yellow-600">F: {item.fat_g}g</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <span className="text-2xl font-black block leading-none">
                      {item.calories}
                    </span>
                    <span className="text-[10px] font-black text-orange-500 uppercase">
                      kcal
                    </span>
                  </div>
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
                    className="p-3 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-zinc-800 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <EditMealModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onDelete={handleDelete}
        itemData={selectedItem}
      />
    </div>
  );
}
