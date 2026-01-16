'use client';

import Link from "next/link";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { Plus, Droplet, Flame, Clock } from "lucide-react";

import { logHydration, getTodayHydration } from "@/app/actions/hydration";
import { getNutritionGoals, getTodayNutrition, NutritionGoals, TodayNutrition } from "@/app/actions/nutrition-goals";
import LogMealModal from "@/app/components/LogMealModal";
import CreateTemplateModal from "@/app/components/CreateTemplateModal";
import ViewTemplateModal from "@/app/components/ViewTemplateModal";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FoodItem {
  name: string;
  type: string;
  amount: string;
  kcal: number;
  p: string;
  c: string;
  f: string;
}

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
  totals: { kcal: number; p: number; c: number; f: number; };
  ingredients: Ingredient[];
}

export default function NutritionPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [hydration, setHydration] = useState(0);
  const [activeMealType, setActiveMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MealTemplate | null>(null);

  // Dynamic goals from user profile
  const [goals, setGoals] = useState<NutritionGoals>({
    calorieGoal: 2000,
    proteinG: 150,
    carbsG: 200,
    fatG: 55,
    hasProfile: false,
  });

  // Today's consumed nutrition
  const [consumed, setConsumed] = useState<TodayNutrition>({
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
  });

  const hydrationGoal = 2500;
  const hydrationPercentage = Math.min(100, Math.round((hydration / hydrationGoal) * 100));

  // HANDLERS 
  const openLogModal = (mealName: string) => {
    const typeMap: Record<string, "breakfast" | "lunch" | "dinner" | "snack"> = {
      "Breakfast": "breakfast",
      "Lunch": "lunch",
      "Dinner": "dinner",
      "Snack": "snack"
    };
    setActiveMealType(typeMap[mealName] || "breakfast");
    setIsLogModalOpen(true);
  };

  const handleAddWater = async (amount: number) => {
    setHydration((prev) => prev + amount);
    const result = await logHydration(amount);
    if (!result.success) setHydration((prev) => prev - amount);
  };

  // Fetch data on mount
  useEffect(() => {
    getTodayHydration().then(setHydration);
    getNutritionGoals().then(setGoals);
    getTodayNutrition().then(setConsumed);
  }, []);

  // Refetch consumed when modal closes (meal was potentially logged)
  const handleModalClose = () => {
    setIsLogModalOpen(false);
    getTodayNutrition().then(setConsumed);
  };

  const macroOptions: ChartOptions<'doughnut'> = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: "80%",
  };

  const createMacroData = (current: number, target: number, color: string) => ({
    datasets: [{
      data: [current, Math.max(0, target - current)],
      backgroundColor: [color, "#18181b"],
      borderWidth: 0,
      borderRadius: 20,
      circumference: 360,
    }],
  });

  // Dynamic macro cards using fetched goals and consumed values
  const caloriesRemaining = Math.max(0, goals.calorieGoal - consumed.caloriesConsumed);
  const proteinStatus = consumed.proteinConsumed >= goals.proteinG * 0.8 ? "High" : consumed.proteinConsumed >= goals.proteinG * 0.5 ? "Good" : "Low";
  const carbsStatus = consumed.carbsConsumed >= goals.carbsG * 0.8 ? "Near" : consumed.carbsConsumed >= goals.carbsG * 0.5 ? "Good" : "Low";
  const fatStatus = consumed.fatConsumed >= goals.fatG * 0.8 ? "Near" : consumed.fatConsumed >= goals.fatG * 0.5 ? "Good" : "Low";

  const macroCards = [
    { label: "Daily Calories", val: consumed.caloriesConsumed, goal: goals.calorieGoal, unit: "kcal", color: "#f97316", footerLabel: "Remaining", footerVal: caloriesRemaining.toString() },
    { label: "Protein", val: consumed.proteinConsumed, goal: goals.proteinG, unit: "g", color: "#206A9E", footerLabel: "Status", footerVal: proteinStatus },
    { label: "Carbs", val: consumed.carbsConsumed, goal: goals.carbsG, unit: "g", color: "#51A255", footerLabel: "Target", footerVal: carbsStatus },
    { label: "Fats", val: consumed.fatConsumed, goal: goals.fatG, unit: "g", color: "#C7831F", footerLabel: "Balance", footerVal: fatStatus },
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30">
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
            Your <span className="text-orange-500">Nutrition</span>
          </h1>
          <p className="text-zinc-500">Track your progress and push your limits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {macroCards.map((m) => (
            <div key={m.label} className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 self-start mb-8">{m.label}</h2>
              <div className="relative w-36 h-36 mb-8">
                <Doughnut data={createMacroData(m.val, m.goal, m.color)} options={macroOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{Math.round((m.val / m.goal) * 100)}%</span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase mt-1">{m.val}{m.unit}</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-500">
                  <span>Goal</span>
                  <span className="text-white">{m.goal} {m.unit}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase border-t border-zinc-800/50 pt-3">
                  <span className="text-zinc-500">{m.footerLabel}</span>
                  <span style={{ color: m.color }}>{m.footerVal} {m.unit === "kcal" ? "kcal" : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Next Up</h2>
              <Link href="#" className="text-orange-500 text-sm font-bold hover:underline">View Full Plan</Link>
            </div>
            <div className="bg-black/40 p-8 rounded-3xl border border-zinc-800/50">
              <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase mb-6">
                <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full">Suggestion • LUNCH</span>
                <span className="flex items-center gap-1 text-zinc-500"><Clock size={12} /> 20 MIN</span>
                <span className="flex items-center gap-1 text-zinc-500"><Flame size={12} /> 580 KCAL</span>
              </div>
              <h3 className="text-3xl font-bold mb-3">Grilled Salmon Bowl</h3>
              <p className="text-zinc-400 text-sm mb-8 max-w-md">Rich in omega-3 fatty acids and high quality protein.</p>
              <div className="flex gap-4">
                <button className="bg-orange-600 px-8 py-3 rounded-2xl font-bold text-sm active:scale-95 transition">Log Meal</button>
                <button className="bg-zinc-800 px-8 py-3 rounded-2xl font-bold text-sm border border-zinc-700">Recipe</button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center">
            <h2 className="text-xl font-bold self-start mb-10">Weekly Goals</h2>
            <div className="relative w-44 h-44 mb-8">
              <Doughnut data={createMacroData(82, 100, "#f97316")} options={macroOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">82%</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase mt-1">On Track</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Today&apos;s Log</h2>
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white text-base mr-1">1,840</span> kcal consumed
              </div>
            </div>
            <div className="space-y-4">
{ [
    { icon: "🥐", name: "Breakfast", type: "breakfast" },
    { icon: "🍲", name: "Lunch", type: "lunch" },
    { icon: "🥗", name: "Dinner", type: "dinner" },
    { icon: "🍎", name: "Snack", type: "snack" },
].map((meal) => (
  <div 
    key={meal.name} 
    className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-zinc-800 hover:bg-zinc-800/40 transition group cursor-pointer"
  >
    {/* Gör hela vänstra delen klickbar till historik-sidan */}
    <Link href={`/nutrition/${meal.type}`} className="flex items-center gap-5 flex-grow">
      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-xl">{meal.icon}</div>
      <div>
        <h4 className="font-bold">{meal.name}</h4>
        <p className="text-zinc-500 text-xs">View history</p>
      </div>
    </Link>

    {/* Behåll plus-knappen för att öppna modalen direkt */}
    <button 
      onClick={(e) => {
        e.preventDefault(); // Hindrar länken från att triggas
        openLogModal(meal.name);
      }} 
      className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
    >
      <Plus size={20} className="text-zinc-400 group-hover:text-white" />
    </button>
  </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col">
            <h2 className="text-xl font-bold mb-8">Meal Templates</h2>
            <div className="space-y-4 mb-6">
              <div className="p-5 bg-black/40 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition cursor-pointer active:scale-[0.98]">
                <div className="font-bold">High Protein Day</div>
                <div className="text-zinc-500 text-xs mt-1 uppercase tracking-tighter">
                  220g Protein • 2400 kcal
                </div>
              </div>
            </div>
            <button onClick={() => setIsTemplateModalOpen(true)} className="w-full py-4 bg-zinc-800/50 border border-zinc-800 border-dashed rounded-2xl text-zinc-500 font-bold hover:text-white transition mt-auto">+ Create Template</button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#E65015] to-[#BC4315] rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-grow">
              <h2 className="text-4xl font-black mb-1">Hydration Status</h2>
              <p className="text-orange-100/80 mb-8 font-medium">Keep it up!</p>
              <div className="h-3 w-full bg-orange-800/40 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${hydrationPercentage}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase text-orange-200">
                <span>{hydrationGoal / 1000}L Goal</span>
                <span className="text-4xl italic text-white">{hydrationPercentage}%</span>
              </div>
            </div>
            <div className="flex gap-4">
              {[250, 500].map((amt) => (
                <button key={amt} onClick={() => handleAddWater(amt)} className="bg-white/10 hover:bg-white/20 p-6 rounded-3xl flex flex-col items-center gap-2 backdrop-blur-md border border-white/10 transition active:scale-95">
                  <Droplet size={24} />
                  <span className="text-[10px] font-black">+{amt}ml</span>
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

      <CreateTemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} onSave={() => setIsTemplateModalOpen(false)} />
      <ViewTemplateModal isOpen={isViewModalOpen} template={selectedTemplate} onClose={() => setIsViewModalOpen(false)} onLog={() => setIsViewModalOpen(false)} />
    </div>
  );
}