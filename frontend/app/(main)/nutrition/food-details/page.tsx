'use client';

import { useState, useEffect } from 'react';
import { getTodayMeals, deleteMealLog } from '@/app/actions/nutrition';
import { Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// --- INTERFACE ---
// Definierar strukturen för en loggad måltid från databasen.
interface MealLog {
  id: string;
  name: string;
  calories: number;
  meal_type: string;
}

export default function FoodDetailsPage() {
  // State för att lagra listan med dagens loggade måltider
  const [items, setItems] = useState<MealLog[]>([]);

  // useEffect hämtar all mat som loggats idag direkt när sidan laddas
  useEffect(() => {
    async function loadData() {
      const data = await getTodayMeals();
      setItems(data as MealLog[]);
    }
    loadData();
  }, []);

  // --- DELETE LOGIK ---
  // Hanterar borttagning av en loggad rad
  const handleDelete = async (id: string) => {
    // Enkel bekräftelse-ruta för att förhindra oavsiktlig radering
    if (!confirm('Delete this log?')) return;

    // Anropar Server Action för att ta bort raden i Supabase/databasen
    const res = await deleteMealLog(id);

    // Om raderingen lyckades i databasen, uppdaterar vi statet (UI)
    // genom att filtrera bort det raderade objektet från listan
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      {/* Tillbakalänk till översikten */}
      <Link
        href="/nutrition"
        className="text-zinc-500 flex items-center gap-2 mb-6 uppercase text-[10px] font-bold tracking-widest"
      >
        <ChevronLeft size={14} /> Nutrition Overview
      </Link>

      <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">
        All <span className="text-orange-500">Logs</span>
      </h1>

      {/* LISTA ÖVER MÅLTIDER */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-zinc-600 italic">No meals logged today yet...</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl flex justify-between items-center"
            >
              <div className="text-left">
                <p className="font-bold text-lg">{item.name}</p>
                <p className="text-zinc-500 text-xs uppercase font-bold">
                  {item.meal_type}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-black">{item.calories} kcal</span>
                {/* Knapp för att radera loggen */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-zinc-600 hover:text-red-500 transition p-2"
                  title="Remove log"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
