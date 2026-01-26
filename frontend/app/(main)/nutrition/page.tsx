"use client";

import Link from "next/link";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { Plus, Droplet } from "lucide-react";

import { logHydration, getTodayHydration } from "@/app/actions/hydration";
import {
  getNutritionGoals,
  getTodayNutrition,
  NutritionGoals,
  TodayNutrition,
} from "@/app/actions/nutrition-goals";
import { getMealTemplates, logMealFromTemplate } from "@/app/actions/nutrition";
import LogMealModal from "@/app/components/LogMealModal";
import CreateTemplateModal from "@/app/components/CreateTemplateModal";
import ViewTemplateModal from "@/app/components/ViewTemplateModal";

ChartJS.register(ArcElement, Tooltip, Legend);

// --- INTERFACES ---
interface Ingredient {
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
}

interface MealTemplate {
  id: string;
  name: string;
  total_kcal?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  totals?: {
    kcal: number;
    p: number;
    c: number;
    f: number;
  };
  ingredients: Ingredient[];
}

export default function NutritionPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [hydration, setHydration] = useState(0);
  const [activeMealType, setActiveMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MealTemplate | null>(null);
  const [templates, setTemplates] = useState<MealTemplate[]>([]);

  // Uppdaterad för att matcha NutritionGoals interfacet exakt
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    hasProfile: false,
  });

  const [consumed, setConsumed] = useState<TodayNutrition>({
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
    caloriesBurned: 0,
  });

  const hydrationGoal = 2500;
  const hydrationPercentage = Math.min(100, Math.round((hydration / hydrationGoal) * 100));

  const fetchData = async () => {
    const [hyd, nutGoals, todayNut, mealTemplates] = await Promise.all([
      getTodayHydration(),
      getNutritionGoals(),
      getTodayNutrition(),
      getMealTemplates()
    ]);

    setHydration(hyd);
    setGoals(nutGoals);
    setConsumed(todayNut);
    setTemplates(mealTemplates as unknown as MealTemplate[]);
  };
  // I din NutritionPage komponent:

  useEffect(() => {
    // Definiera funktionen här inne för att undvika onödiga omrenderingar
    const loadData = async () => {
      try {
        const [hyd, nutGoals, todayNut, mealTemplates] = await Promise.all([
          getTodayHydration(),
          getNutritionGoals(),
          getTodayNutrition(),
          getMealTemplates()
        ]);

        setHydration(hyd);
        setGoals(nutGoals);
        setConsumed(todayNut);
        setTemplates(mealTemplates as unknown as MealTemplate[]);
      } catch (error) {
        console.error("Kunde inte hämta data:", error);
      }
    };

    loadData();
  }, []); // Tom array betyder att den bara körs vid första laddningen

  const handleLogTemplate = async (template: MealTemplate, mealType: "breakfast" | "lunch" | "dinner" | "snack") => {
    const result = await logMealFromTemplate(template, mealType);
    if (result.success) {
      setIsViewModalOpen(false);
      fetchData();
    } else {
      alert("Error logging template: " + result.error);
    }
  };

  const openLogModal = (mealName: string) => {
    const typeMap: Record<string, "breakfast" | "lunch" | "dinner" | "snack"> = {
      Breakfast: "breakfast",
      Lunch: "lunch",
      Dinner: "dinner",
      Snack: "snack",
    };
    setActiveMealType(typeMap[mealName] || "breakfast");
    setIsLogModalOpen(true);
  };

  const handleAddWater = async (amount: number) => {
    setHydration((prev) => prev + amount);
    const result = await logHydration(amount);
    if (!result.success) setHydration((prev) => prev - amount);
  };

  const handleModalClose = () => {
    setIsLogModalOpen(false);
    setIsTemplateModalOpen(false);
    fetchData();
  };

  const macroOptions: ChartOptions<"doughnut"> = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: "80%",
  };

  const createMacroData = (current: number, target: number, color: string) => ({
    datasets: [
      {
        data: [current, Math.max(0, target - current)],
        backgroundColor: [color, "#18181b"],
        borderWidth: 0,
        borderRadius: 20,
        circumference: 360,
      },
    ],
  });

  // BERÄKNINGAR (Använder de nya namnen)
  const totalCalorieBudget = (goals.calories || 2000) + (consumed.caloriesBurned || 0);
  const caloriesRemaining = Math.max(0, totalCalorieBudget - consumed.caloriesConsumed);

  const proteinStatus = consumed.proteinConsumed >= goals.protein * 0.8 ? "High" : consumed.proteinConsumed >= goals.protein * 0.5 ? "Good" : "Low";
  const carbsStatus = consumed.carbsConsumed >= goals.carbs * 0.8 ? "Near" : consumed.carbsConsumed >= goals.carbs * 0.5 ? "Good" : "Low";
  const fatStatus = consumed.fatConsumed >= goals.fat * 0.8 ? "Near" : consumed.fatConsumed >= goals.fat * 0.5 ? "Good" : "Low";

  const macroCards = [
    {
      label: "Daily Calories",
      val: consumed.caloriesConsumed,
      goal: totalCalorieBudget,
      unit: "kcal",
      color: "#f97316",
      footerLabel: "Remaining",
      footerVal: caloriesRemaining.toString(),
      extra: consumed.caloriesBurned > 0 ? `+${consumed.caloriesBurned} from exercise` : null
    },
    {
      label: "Protein",
      val: consumed.proteinConsumed,
      goal: goals.protein,
      unit: "g",
      color: "#206A9E",
      footerLabel: "Status",
      footerVal: proteinStatus,
    },
    {
      label: "Carbs",
      val: consumed.carbsConsumed,
      goal: goals.carbs,
      unit: "g",
      color: "#51A255",
      footerLabel: "Target",
      footerVal: carbsStatus,
    },
    {
      label: "Fats",
      val: consumed.fatConsumed,
      goal: goals.fat,
      unit: "g",
      color: "#C7831F",
      footerLabel: "Balance",
      footerVal: fatStatus,
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30 pb-20">
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-10 text-left">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
            Your <span className="text-orange-500">Nutrition</span>
          </h1>
          <p className="text-zinc-500">
            Track your progress and push your limits.
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {macroCards.map((m) => (
            <div
              key={m.label}
              className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 self-start mb-8">
                {m.label}
              </h2>
              <div className="relative w-36 h-36 mb-8">
                <Doughnut
                  data={createMacroData(m.val, m.goal, m.color)}
                  options={macroOptions}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">
                    {Math.round((m.val / (m.goal || 1)) * 100)}%
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase mt-1">
                    {m.val} {m.unit}
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3 text-left">
                <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-500">
                  <span>Goal</span>
                  <span className="text-white">
                    {m.goal} {m.unit}
                  </span>
                </div>
                {m.extra && (
                  <div className="text-[9px] text-orange-500 font-bold uppercase tracking-tighter">
                    {m.extra}
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-bold uppercase border-t border-zinc-800/50 pt-3">
                  <span className="text-zinc-500">{m.footerLabel}</span>
                  <span style={{ color: m.color }}>
                    {m.footerVal} {m.unit === "kcal" ? "kcal" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOG SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 text-left">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Today&apos;s Log</h2>
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white text-base mr-1">
                  {consumed.caloriesConsumed}
                </span>{" "}
                kcal consumed
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: "🥐", name: "Breakfast", type: "breakfast" },
                { icon: "🍲", name: "Lunch", type: "lunch" },
                { icon: "🥗", name: "Dinner", type: "dinner" },
                { icon: "🍎", name: "Snack", type: "snack" },
              ].map((meal) => (
                <div
                  key={meal.name}
                  className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-zinc-800 hover:bg-zinc-800/40 transition group cursor-pointer"
                >
                  <Link
                    href={`/nutrition/${meal.type}`}
                    className="flex items-center gap-5 flex-grow text-left"
                  >
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">
                      {meal.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{meal.name}</h4>
                      <p className="text-zinc-500 text-xs">View history</p>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openLogModal(meal.name);
                    }}
                    className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
                  >
                    <Plus
                      size={20}
                      className="text-zinc-400 group-hover:text-white"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* MEAL TEMPLATES COLUMN */}
          <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col text-left">
            <h2 className="text-xl font-bold mb-8 italic uppercase tracking-tight">
              Meal <span className="text-orange-500">Templates</span>
            </h2>
            <div className="space-y-4 mb-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {templates.length === 0 ? (
                <p className="text-zinc-600 text-xs italic py-4">
                  No templates yet...
                </p>
              ) : (
                templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setIsViewModalOpen(true);
                    }}
                    className="p-5 bg-black/40 rounded-2xl border border-zinc-800 hover:border-orange-500/50 transition cursor-pointer active:scale-[0.98] group text-left"
                  >
                    <div className="font-bold group-hover:text-orange-500 transition uppercase tracking-tighter">
                      {t.name}
                    </div>
                    <div className="text-zinc-500 text-[10px] mt-1 uppercase font-black tracking-widest flex justify-between">
                      <span>{t.total_kcal} kcal</span>
                      <span className="text-orange-500/40 italic">
                        P:{t.total_protein}g C:{t.total_carbs}g
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="w-full py-4 bg-zinc-800/50 border border-zinc-800 border-dashed rounded-2xl text-zinc-500 font-bold hover:text-white hover:border-zinc-600 transition mt-auto uppercase text-[10px] tracking-widest"
            >
              + Create Template
            </button>
          </div>
        </div>

        {/* HYDRATION SECTION */}
        <div className="bg-gradient-to-br from-[#E65015] to-[#BC4315] rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-orange-900/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-grow text-left">
              <h2 className="text-4xl font-black mb-1 uppercase italic tracking-tighter text-white">
                Hydration Status
              </h2>
              <p className="text-orange-100/80 mb-8 font-medium">
                Crush your daily water goals.
              </p>
              <div className="h-4 w-full bg-orange-800/40 rounded-full overflow-hidden mb-4 border border-orange-400/20">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${hydrationPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase text-orange-200 tracking-widest">
                <span>{hydrationGoal / 1000}L Goal</span>
                <span className="text-4xl italic text-white font-black">
                  {hydrationPercentage}%
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              {[250, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddWater(amt)}
                  className="bg-white/10 hover:bg-white/20 p-8 rounded-[2rem] flex flex-col items-center gap-2 backdrop-blur-md border border-white/10 transition active:scale-95 group"
                >
                  <Droplet
                    size={28}
                    className="group-hover:scale-110 transition"
                  />
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    +{amt}ml
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <LogMealModal
        isOpen={isLogModalOpen}
        onClose={handleModalClose}
        selectedType={activeMealType}
      />

      <CreateTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleModalClose}
      />

      <ViewTemplateModal
        isOpen={isViewModalOpen}
        template={
          selectedTemplate
            ? {
              ...selectedTemplate,
              totals: {
                kcal: selectedTemplate.total_kcal || 0,
                p: selectedTemplate.total_protein || 0,
                c: selectedTemplate.total_carbs || 0,
                f: selectedTemplate.total_fat || 0,
              },
            }
            : null
        }
        onClose={() => setIsViewModalOpen(false)}
        onLog={handleLogTemplate}
      />
    </div>
  );
}