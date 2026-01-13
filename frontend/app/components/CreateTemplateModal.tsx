'use client';

import React, { useState } from 'react';
import { Plus, Star, X, Trash2 } from 'lucide-react'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Ingredient {
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
}

interface TemplateData {
  name: string;
  ingredients: Ingredient[];
  totals: {
    kcal: number;
    p: number;
    c: number;
    f: number;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TemplateData) => void;
}

export default function CreateTemplateModal({ isOpen, onClose, onSave }: Props) {
  const [templateName, setTemplateName] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIng, setCurrentIng] = useState({ name: '', kcal: '', p: '', c: '', f: '' });

  if (!isOpen) return null;

  const totals = ingredients.reduce((acc, curr) => ({
    kcal: acc.kcal + curr.kcal,
    p: acc.p + curr.p,
    c: acc.c + curr.c,
    f: acc.f + curr.f,
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  const chartData = {
    datasets: [{
      data: [totals.p || 1, totals.c || 1, totals.f || 1],
      backgroundColor: ['#206A9E', '#51A255', '#C7831F'],
      borderWidth: 0,
      borderRadius: 20,
      circumference: 360,
    }],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%',
  };

  const addIngredient = () => {
    if (!currentIng.name || !currentIng.kcal) return;
    setIngredients([...ingredients, {
      name: currentIng.name,
      kcal: Number(currentIng.kcal),
      p: Number(currentIng.p || 0),
      c: Number(currentIng.c || 0),
      f: Number(currentIng.f || 0),
    }]);
    setCurrentIng({ name: '', kcal: '', p: '', c: '', f: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 shadow-2xl overflow-hidden">
        
        <button onClick={onClose} className="absolute top-8 right-10 text-zinc-500 hover:text-white transition">
           <X size={24} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-white uppercase">
            Build Meal <span className="text-orange-500">Template</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium italic">Combine ingredients into a saved favorite.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* VÄNSTRA KOLUMNEN */}
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-3xl border border-zinc-800/50 text-left">
              <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest">Template Name</label>
              <input 
                type="text" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Post-Workout Feast" 
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 transition outline-none" 
              />
            </div>

            <div className="bg-black/20 p-6 rounded-3xl border border-zinc-800/50 space-y-4 text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Add Ingredient</h3>
              <input 
                placeholder="Name (e.g., Oats)" 
                value={currentIng.name}
                onChange={(e) => setCurrentIng({...currentIng, name: e.target.value})}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1">Calories</label>
                    <input type="number" placeholder="kcal" value={currentIng.kcal} onChange={e => setCurrentIng({...currentIng, kcal: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1 flex items-center gap-2 italic">
                      <div className="w-2 h-2 rounded-full bg-blue-500"/> Protein
                    </label>
                    <input type="number" placeholder="g" value={currentIng.p} onChange={e => setCurrentIng({...currentIng, p: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1 flex items-center gap-2 italic">
                      <div className="w-2 h-2 rounded-full bg-green-500"/> Carbs
                    </label>
                    <input type="number" placeholder="g" value={currentIng.c} onChange={e => setCurrentIng({...currentIng, c: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest px-1 flex items-center gap-2 italic">
                      <div className="w-2 h-2 rounded-full bg-yellow-600"/> Fats
                    </label>
                    <input type="number" placeholder="g" value={currentIng.f} onChange={e => setCurrentIng({...currentIng, f: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                 </div>
              </div>
              <button 
                type="button"
                onClick={addIngredient}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Ingredient
              </button>
            </div>
          </div>

          {/* HÖGRA KOLUMNEN */}
          <div className="flex flex-col">
            <div className="bg-black/20 p-8 rounded-3xl border border-zinc-800/50 flex-grow flex flex-col items-center justify-center relative">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 absolute top-8">Template Preview</h3>
              
              <div className="relative w-44 h-44 my-6">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{totals.kcal}</span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">KCAL</span>
                </div>
              </div>

              <div className="w-full space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar mt-4">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl group">
                    <div className="text-left">
                      <div className="text-sm font-bold text-white uppercase tracking-tight">{ing.name}</div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase italic mt-1">{ing.kcal} kcal</div>
                    </div>
                    <button onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-orange-950/20 border border-orange-900/30 p-6 rounded-3xl text-left">
              <h4 className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 italic">
                <Star size={14} fill="currentColor" /> Template Mode Active
              </h4>
              <p className="text-orange-200/60 text-[11px] leading-relaxed font-medium">
                All ingredients added here will be bundled into one single template.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button type="button" onClick={onClose} className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition text-zinc-400">
            Cancel
          </button>
          <button 
            type="button"
            onClick={() => onSave({ name: templateName, ingredients, totals })}
            disabled={ingredients.length === 0}
            className="px-12 py-4 bg-orange-600 hover:bg-orange-500 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition text-white flex items-center gap-2 shadow-xl shadow-orange-900/20 disabled:opacity-30"
          >
            <Plus size={18} /> Save Template
          </button>
        </div>
      </div>
    </div>
  );
}