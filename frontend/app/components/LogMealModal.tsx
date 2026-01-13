'use client';

import React, { useState } from 'react';
import { Plus, Star, Utensils, X } from 'lucide-react'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: FoodItem) => void;
}

export default function LogMealModal({ isOpen, onClose, onAdd }: Props) {
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serving: '100',
    kcal: '',
    p: '',
    c: '',
    f: '',
  });

  if (!isOpen) return null;

  // CHART DATA 
  const chartData = {
    datasets: [{
      data: [
        Number(formData.p) || 0, 
        Number(formData.c) || 0, 
        Number(formData.f) || 0,
        // Om alla är noll, visa en tom mörk cirkel
        (Number(formData.p) + Number(formData.c) + Number(formData.f)) === 0 ? 1 : 0
      ],
      backgroundColor: [
        '#206A9E', // Protein
        '#51A255', // Carbs
        '#C7831F', // Fats
        '#18181b'  // Bakgrund om tom
      ],
      borderWidth: 0,
      borderRadius: 20,
      circumference: 360,
    }],
  };

  // CHART OPTIONS (för att dölja tooltip när alla värden är noll) 
  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: { 
      tooltip: { enabled: false }, 
      legend: { display: false } 
    },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%',
  };

  const handleAdd = () => {
    if (!formData.name || !formData.kcal) return;
    
    const newItem: FoodItem = {
      name: formData.name,
      type: saveAsFavorite ? 'TEMPLATE' : 'MANUAL',
      amount: `${formData.serving}g`,
      kcal: Number(formData.kcal),
      p: `${formData.p || 0}g`,
      c: `${formData.c || 0}g`,
      f: `${formData.f || 0}g`,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 overflow-hidden shadow-2xl">
        
        {/* Stäng-knapp */}
        <button onClick={onClose} className="absolute top-8 right-10 text-zinc-500 hover:text-white transition">
           <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase">
            Add New <span className="text-orange-500">Food Item</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-2 font-normal italic">
            Enter the nutritional details for your custom food item.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-3xl border border-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 px-1">Basic Information</h3>
              <div className="space-y-4 text-white font-bold">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1">Food Item Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Grilled Chicken Breast" 
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1">Serving Size</label>
                    <input 
                      type="text" 
                      value={formData.serving}
                      onChange={(e) => setFormData({...formData, serving: e.target.value})}
                      placeholder="100" 
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1">Unit</label>
                    <select className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none">
                      <option>Grams (g)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-3xl border border-zinc-800/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 px-1">Macro Nutrients</h3>
              <div className="space-y-4 text-white font-bold">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1">Calories (kcal)</label>
                  <input 
                    type="number" 
                    value={formData.kcal}
                    onChange={(e) => setFormData({...formData, kcal: e.target.value})}
                    placeholder="0" 
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block flex items-center gap-2 tracking-widest italic px-1 text-blue-400">
                      <div className="w-2 h-2 rounded-full bg-blue-500" /> Protein
                    </label>
                    <input 
                      type="number" 
                      value={formData.p}
                      onChange={(e) => setFormData({...formData, p: e.target.value})} 
                      placeholder="0" 
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block flex items-center gap-2 tracking-widest italic px-1 text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> Carbs
                    </label>
                    <input 
                      type="number" 
                      value={formData.c}
                      onChange={(e) => setFormData({...formData, c: e.target.value})} 
                      placeholder="0" 
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block flex items-center gap-2 tracking-widest italic px-1 text-yellow-600">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" /> Fats
                  </label>
                  <input 
                    type="number" 
                    value={formData.f}
                    onChange={(e) => setFormData({...formData, f: e.target.value})} 
                    placeholder="0" 
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm w-1/2 outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <div className="bg-black/20 p-8 rounded-3xl border border-zinc-800/50 flex-grow flex flex-col items-center justify-center relative">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 absolute top-8">Item Preview</h3>
              
              <div className="relative w-44 h-44 my-6">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{formData.kcal || 0}</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">KCAL</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setSaveAsFavorite(!saveAsFavorite)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all mb-8 w-full justify-center group ${
                  saveAsFavorite 
                  ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/40 scale-[1.02]' 
                  : 'bg-zinc-800/40 border-zinc-700 text-zinc-400 hover:border-orange-500/50 hover:bg-zinc-800/60'
                }`}
              >
                {saveAsFavorite ? <Star size={16} fill="white" /> : <Star size={16} className="group-hover:text-orange-500 transition-colors" />}
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {saveAsFavorite ? 'Saved as Template' : 'Add to Meal Template'}
                </span>
              </button>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/50 text-white">
                  <span className="text-blue-400">Protein</span>
                  <span>{formData.p || 0}g</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/50 text-white">
                  <span className="text-green-500">Carbs</span>
                  <span>{formData.c || 0}g</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50 text-white">
                  <span className="text-yellow-600">Fats</span>
                  <span>{formData.f || 0}g</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-orange-950/20 border border-orange-900/30 p-6 rounded-3xl">
              <h4 className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 italic">
                <Utensils size={14} /> Quick Tip
              </h4>
              <p className="text-orange-200/60 text-[11px] leading-relaxed font-normal">
                Templates allow you to log this exact meal combination with one click from your nutrition dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 mt-12">
          <button type="button" onClick={onClose} className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition text-zinc-400">
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleAdd}
            className="px-12 py-4 bg-orange-600 hover:bg-orange-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition text-white flex items-center gap-2 shadow-xl shadow-orange-900/20 active:scale-95"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>
    </div>
  );
}