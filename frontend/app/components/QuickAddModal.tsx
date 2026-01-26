"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { getMealTemplates, logMealFromTemplate, logMeal } from "@/app/actions/nutrition";

// Definiera exakt vad som kommer från getMealTemplates
interface RawTemplate {
  id: string;
  name: string;
  total_kcal: number | null;
  total_p: number | null;
  total_c: number | null;
  total_f: number | null;
}

interface Template {
  id: string;
  name: string;
  total_kcal: number;
  total_p: number;
  total_c: number;
  total_f: number;
}

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
  mealType: MealType;
}

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export default function QuickAddModal({ isOpen, onClose, onAdded, mealType }: QuickAddModalProps) {
  const [activeTab, setActiveTab] = useState<"templates" | "manual">("templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  const [manualData, setManualData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  });

  useEffect(() => {
    if (isOpen && activeTab === "templates") {
      const loadTemplates = async () => {
        setLoading(true);
        try {
          const data = await getMealTemplates();
          // Här mappar vi om datan utan att använda 'any'
          const formattedData: Template[] = (data as unknown as RawTemplate[] || []).map((item) => ({
            id: item.id,
            name: item.name,
            total_kcal: item.total_kcal ?? 0,
            total_p: item.total_p ?? 0,
            total_c: item.total_c ?? 0,
            total_f: item.total_f ?? 0,
          }));
          setTemplates(formattedData);
        } catch (error) {
          console.error("Error loading templates:", error);
        } finally {
          setLoading(false);
        }
      };
      loadTemplates();
    }
  }, [isOpen, activeTab]);

  const handleTemplateAdd = async (template: Template) => {
    const res = await logMealFromTemplate(
      {
        name: template.name,
        total_kcal: template.total_kcal,
        total_protein: template.total_p,
        total_carbs: template.total_c,
        total_fat: template.total_f,
      },
      mealType
    );
    if (res.success) {
      onAdded();
      onClose();
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Säkerställ att mealType är en giltig typ
    const validMealType = mealType as MealType;

    const res = await logMeal({
      name: manualData.name,
      type: validMealType,
      calories: Number(manualData.calories),
      protein: Number(manualData.protein),
      carbs: Number(manualData.carbs),
      fat: Number(manualData.fat),
    });

    if (res.success) {
      setManualData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
      onAdded();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Add <span className="text-orange-500">{mealType}</span>
            </h2>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("templates")}
                className={`text-[10px] font-bold uppercase tracking-widest transition ${activeTab === "templates" ? "text-orange-500" : "text-zinc-500 hover:text-white"}`}
              >
                Templates
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`text-[10px] font-bold uppercase tracking-widest transition ${activeTab === "manual" ? "text-orange-500" : "text-zinc-500 hover:text-white"}`}
              >
                Manual Entry
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition self-start">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "templates" ? (
            <div className="grid gap-3">
              {loading ? (
                <div className="py-10 text-center text-zinc-500 font-bold uppercase text-[10px] animate-pulse">Loading templates...</div>
              ) : templates.length === 0 ? (
                <p className="text-zinc-500 text-center py-10 text-sm">No templates found.</p>
              ) : (
                templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateAdd(t)}
                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center hover:border-orange-500/50 transition-all text-left group"
                  >
                    <div>
                      <span className="block font-bold text-white group-hover:text-orange-500">{t.name}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">P: {t.total_p}g | C: {t.total_c}g | F: {t.total_f}g</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="text-sm font-black">{t.total_kcal} kcal</span>
                      <Plus size={16} className="text-orange-500" />
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block">Item Name</label>
                <input
                  required
                  value={manualData.name}
                  onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition"
                  placeholder="e.g. Chicken Salad"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block">Calories</label>
                  <input
                    type="number" required
                    value={manualData.calories}
                    onChange={(e) => setManualData({ ...manualData, calories: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block">Protein (g)</label>
                  <input
                    type="number" required
                    value={manualData.protein}
                    onChange={(e) => setManualData({ ...manualData, protein: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block">Carbs (g)</label>
                  <input
                    type="number" required
                    value={manualData.carbs}
                    onChange={(e) => setManualData({ ...manualData, carbs: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block">Fats (g)</label>
                  <input
                    type="number" required
                    value={manualData.fat}
                    onChange={(e) => setManualData({ ...manualData, fat: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-black font-black uppercase italic py-4 rounded-2xl mt-4 hover:bg-orange-400 transition active:scale-95"
              >
                Log Meal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}