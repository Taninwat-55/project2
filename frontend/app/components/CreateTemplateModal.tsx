'use client';

import React, { useState } from 'react';
import { Plus, Star, X, Trash2 } from 'lucide-react'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// Importera din server action
import { saveMealTemplate } from "@/app/actions/nutrition";

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
  const [isSaving, setIsSaving] = useState(false);

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

  // NY FUNKTION FÖR ATT HANTERA SPARNING TILL DB 
  const handleInternalSave = async () => {
    if (!templateName || ingredients.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    const templateData = { name: templateName, ingredients, totals };

    try {
      const result = await saveMealTemplate(templateData);
      if (result.success) {
        console.log("✅ Mall sparad!");
        onSave(templateData); 
        onClose();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-4">
      {/* MODAL CONTAINER: Max-height och scroll fixad här */}
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[95vh] custom-scrollbar">
        
        <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-10 text-zinc-500 hover:text-white transition z-10">
           <X size={24} />
        </button>

        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
            Build Meal <span className="text-orange-500">Template</span>
          </h2>
          <p className="text-zinc-500 text-[10px] md:text-sm mt-2 font-medium italic uppercase tracking-widest">Combine ingredients into a saved favorite.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          
          {/* VÄNSTRA KOLUMNEN: Inputs */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-black/20 p-4 md:p-6 rounded-3xl border border-zinc-800/50 text-left">
              <label className="text-[9px] font-black text-zinc-500 uppercase mb-2 block tracking-widest">Template Name</label>
              <input 
                type="text" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Post-Workout Feast" 
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 transition outline-none" 
              />
            </div>

            <div className="bg-black/20 p-4 md:p-6 rounded-3xl border border-zinc-800/50 space-y-4 text-left">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Add Ingredient</h3>
              <input 
                placeholder="Name (e.g., Oats)" 
                value={currentIng.name}
                onChange={(e) => setCurrentIng({...currentIng, name: e.target.value})}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-500"
              />
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase mb-1 block tracking-widest px-1">Calories</label>
                    <input type="number" placeholder="kcal" value={currentIng.kcal} onChange={e => setCurrentIng({...currentIng, kcal: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase mb-1 block tracking-widest px-1 flex items-center gap-2 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Protein
                    </label>
                    <input type="number" placeholder="g" value={currentIng.p} onChange={e => setCurrentIng({...currentIng, p: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase mb-1 block tracking-widest px-1 flex items-center gap-2 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Carbs
                    </label>
                    <input type="number" placeholder="g" value={currentIng.c} onChange={e => setCurrentIng({...currentIng, c: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-zinc-500 uppercase mb-1 block tracking-widest px-1 flex items-center gap-2 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-600"/> Fats
                    </label>
                    <input type="number" placeholder="g" value={currentIng.f} onChange={e => setCurrentIng({...currentIng, f: e.target.value})} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                  </div>
              </div>
              <button 
                type="button"
                onClick={addIngredient}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Ingredient
              </button>
            </div>
          </div>

          {/* HÖGRA KOLUMNEN: Preview & Lista */}
          <div className="flex flex-col min-h-0">
            <div className="bg-black/20 p-6 md:p-8 rounded-3xl border border-zinc-800/50 flex-grow flex flex-col items-center justify-between relative overflow-hidden">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Template Preview</h3>
              
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-black text-white">{totals.kcal}</span>
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">KCAL</span>
                </div>
              </div>

              {/* INTERN SCROLL FÖR INGREDIENSER: Viktigt för laptop */}
              <div className="w-full space-y-2 max-h-[180px] md:max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-zinc-800/30 border border-zinc-700/50 rounded-xl group">
                    <div className="text-left">
                      <div className="text-xs font-bold text-white uppercase tracking-tight">{ing.name}</div>
                      <div className="text-[9px] font-black text-zinc-500 uppercase italic mt-0.5">{ing.kcal} kcal</div>
                    </div>
                    <button onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {ingredients.length === 0 && (
                   <div className="py-10 text-[10px] uppercase font-black text-zinc-700 tracking-tighter italic">No fuel added yet...</div>
                )}
              </div>
            </div>

            <div className="mt-4 bg-orange-950/20 border border-orange-900/30 p-4 rounded-2xl text-left hidden md:block">
              <h4 className="text-orange-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-1 italic">
                <Star size={12} fill="currentColor" /> Template Mode
              </h4>
              <p className="text-orange-200/60 text-[10px] leading-tight font-medium">
                Bundling ingredients into one blueprint.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-3 mt-8 md:mt-12">
          <button type="button" onClick={onClose} className="order-2 md:order-1 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full font-black text-[9px] uppercase tracking-[0.2em] transition text-zinc-400">
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleInternalSave}
            disabled={ingredients.length === 0 || isSaving}
            className="order-1 md:order-2 px-10 py-3 bg-orange-600 hover:bg-orange-500 rounded-full font-black text-[9px] uppercase tracking-[0.2em] transition text-white flex items-center justify-center gap-2 shadow-xl shadow-orange-900/20 disabled:opacity-30"
          >
            {isSaving ? "Saving..." : <><Plus size={16} /> Save Template</>}
          </button>
        </div>
      </div>
    </div>
  );
}