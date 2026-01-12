'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogMealModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const chartData = {
    datasets: [{
      data: [33, 33, 34], // Example split
      backgroundColor: ['#206A9E', '#51A255', '#C7831F'],
      borderWidth: 0,
      cutout: '80%',
    }],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900/90 border border-zinc-800 rounded-[3rem] p-12 overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Add New <span className="text-orange-500">Food Item</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium">
            Enter the nutritional details for your custom food item.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-black/20 p-6 rounded-3xl border border-zinc-800/50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Food Item Name</label>
                  <input type="text" placeholder="e.g., Grilled Chicken Breast with Herbs" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Serving Size</label>
                    <input type="text" placeholder="e.g., 100" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Unit</label>
                    <select className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none">
                      <option>Grams (g)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Nutrients */}
            <div className="bg-black/20 p-6 rounded-3xl border border-zinc-800/50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Macro Nutrients</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Calories (kcal)</label>
                  <input type="number" placeholder="0" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" /> Protein
                    </label>
                    <input type="number" placeholder="0" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> Carbohydrates
                    </label>
                    <input type="number" placeholder="0" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" /> Fats
                  </label>
                  <input type="number" placeholder="0" className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col">
            <div className="bg-black/20 p-8 rounded-3xl border border-zinc-800/50 flex-grow flex flex-col items-center justify-center relative">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 absolute top-8">Item Preview</h3>
              <div className="relative w-48 h-48 my-8">
                <Doughnut data={chartData} options={{ plugins: { legend: { display: false } } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black">0</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">KCAL</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                  <span className="text-blue-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Protein</span>
                  <span>0%</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                  <span className="text-green-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Carbs</span>
                  <span>0%</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                  <span className="text-yellow-600 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-600" /> Fats</span>
                  <span>0%</span>
                </div>
              </div>
            </div>

            {/* Quick Tip */}
            <div className="mt-6 bg-orange-950/20 border border-orange-900/30 p-6 rounded-3xl">
              <h4 className="text-orange-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                💡 Quick Tip
              </h4>
              <p className="text-orange-200/60 text-[11px] leading-relaxed">
                Accurate tracking requires measuring your food raw when possible. Oils and sauces can add significant calories!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button onClick={onClose} className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-full font-bold text-sm transition">
            Cancel
          </button>
          <button className="px-12 py-4 bg-orange-600 hover:bg-orange-500 rounded-full font-bold text-sm transition flex items-center gap-2">
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>
    </div>
  );
}