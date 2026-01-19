"use client";

import { useState, useEffect } from "react";
import { getTodayMeals, deleteMealLog } from "@/app/actions/nutrition";
import { Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface MealLog {
  id: string;
  name: string;
  calories: number;
  meal_type: string;
}

export default function FoodDetailsPage() {
  const [items, setItems] = useState<MealLog[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getTodayMeals();
      setItems(data as MealLog[]);
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this log?")) return;
    const res = await deleteMealLog(id);
    if (res.success) {
      setItems((prev) => prev.filter(i => i.id !== id));
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <Link href="/nutrition" className="text-zinc-500 flex items-center gap-2 mb-6 uppercase text-[10px] font-bold tracking-widest">
        <ChevronLeft size={14} /> Nutrition Overview
      </Link>
      <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">
        All <span className="text-orange-500">Logs</span>
      </h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{item.name}</p>
              <p className="text-zinc-500 text-xs uppercase font-bold">{item.meal_type}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-black">{item.calories} kcal</span>
              <button onClick={() => handleDelete(item.id)} className="text-zinc-600 hover:text-red-500 transition">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}