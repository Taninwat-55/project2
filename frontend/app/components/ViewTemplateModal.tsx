'use client';

import React from 'react';
import { X, Trash2, Utensils } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrering av Chart.js-komponenter för att möjliggöra cirkeldiagrammet
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
  totals: {
    kcal: number;
    p: number;
    c: number;
    f: number;
  };
  ingredients: Ingredient[];
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Props {
  isOpen: boolean; // Om modalen ska visas
  onClose: () => void; // Funktion för att stänga modalen
  template: MealTemplate | null; // Mallen som ska visas (eller null om ingen valts)
  onDelete?: (id: string) => void; // Valfri funktion för att radera mallen
  onLog: (template: MealTemplate, mealType: MealType) => void; // Funktion för att spara till dagboken
}

export default function ViewTemplateModal({
  isOpen,
  onClose,
  template,
  onDelete,
  onLog,
}: Props) {
  // Early return: Om modalen är stängd eller om det inte finns någon mall att visa, rendera ingenting
  if (!isOpen || !template) return null;

  // --- DIAGRAM-DATA ---
  const chartData = {
    datasets: [
      {
        data: [
          template.totals?.p || 0,
          template.totals?.c || 0,
          template.totals?.f || 0,
        ],
        backgroundColor: ['#206A9E', '#51A255', '#C7831F'], // Blå för Protein, Grön för Kolhydrater, Orange för Fett
        borderWidth: 0,
        borderRadius: 20,
        circumference: 360,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: { display: false }, // Vi döljer legenden eftersom vi har egna rutor under diagrammet
      tooltip: { enabled: true },
    },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%', 
  };

  // En hjälp-array för att rendera de fyra loggnings-knapparna
  const mealTypes: { label: string; id: MealType }[] = [
    { label: 'Breakfast', id: 'breakfast' },
    { label: 'Lunch', id: 'lunch' },
    { label: 'Dinner', id: 'dinner' },
    { label: 'Snack', id: 'snack' },
  ];

  return (
    // BAKGRUND (Overlay)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      {/* MODAL-CONTAINER */}
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 shadow-2xl overflow-hidden">
        {/* Stäng-knapp (X) i hörnet */}
        <button
          onClick={onClose}
          className="absolute top-8 right-10 text-zinc-500 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* HEADER: Mallens namn och beskrivning */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase">
            {template.name}
          </h2>
          <p className="text-zinc-500 text-sm mt-2 font-normal italic">
            Review and log your saved meal template.
          </p>
        </div>

        {/* TVÅKOLUMNS-LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* VÄNSTRA KOLUMNEN: Ingredienslista */}
          <div className="flex flex-col">
            <div className="bg-black/20 p-8 rounded-3xl border border-zinc-800/50 flex-grow h-[400px] flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                <Utensils size={14} /> Ingredients
              </h3>

              {/* Scrollbart område för ingredienser */}
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {template.ingredients?.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl"
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold text-white uppercase tracking-tight">
                        {ing.name}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase italic mt-1">
                        {ing.kcal} kcal • P: {ing.p}g C: {ing.c}g F: {ing.f}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Radera-knapp längst ner till vänster */}
              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <button
                  onClick={() => onDelete && onDelete(template.id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition"
                >
                  <Trash2 size={14} /> Delete Template
                </button>
              </div>
            </div>
          </div>

          {/* HÖGRA KOLUMNEN: Diagram och Loggnings-sektion */}
          <div className="flex flex-col space-y-6">
            {/* Makro-distribution (Diagrammet) */}
            <div className="bg-black/20 p-8 rounded-3xl border border-zinc-800/50 flex flex-col items-center justify-center relative">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 absolute top-8">
                Macro Distribution
              </h3>

              <div className="relative w-40 h-40 my-6">
                <Doughnut data={chartData} options={chartOptions} />
                {/* Kalorier i mitten av diagrammet */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">
                    {template.totals?.kcal}
                  </span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                    KCAL
                  </span>
                </div>
              </div>

              {/* Snabbkoll för P, C, F i siffror under diagrammet */}
              <div className="w-full grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                  <div className="text-blue-400 text-[10px] font-black uppercase mb-1 tracking-tighter">
                    Protein
                  </div>
                  <div className="text-sm font-bold text-white">
                    {template.totals?.p}g
                  </div>
                </div>
                <div className="text-center p-3 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                  <div className="text-green-500 text-[10px] font-black uppercase mb-1 tracking-tighter">
                    Carbs
                  </div>
                  <div className="text-sm font-bold text-white">
                    {template.totals?.c}g
                  </div>
                </div>
                <div className="text-center p-3 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                  <div className="text-yellow-600 text-[10px] font-black uppercase mb-1 tracking-tighter">
                    Fats
                  </div>
                  <div className="text-sm font-bold text-white">
                    {template.totals?.f}g
                  </div>
                </div>
              </div>
            </div>

            {/* LOGGNINGS-PANEL: Välj vilken måltidstyp mallen ska loggas som */}
            <div className="bg-black/20 p-8 rounded-3xl border border-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 text-center">
                Log to Daily Diary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {mealTypes.map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => onLog(template, meal.id)}
                    className="py-4 bg-zinc-800/50 hover:bg-orange-600 border border-zinc-800 hover:border-orange-500 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-all active:scale-95"
                  >
                    {meal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stäng-knapp längst ner */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onClose}
            className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition text-zinc-400"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
