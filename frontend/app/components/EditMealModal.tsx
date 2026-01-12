'use client';

import React from 'react';
import { X, Save, Trash2 } from 'lucide-react';

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: {
    name: string;
    kcal: number;
    p: string;
    c: string;
    f: string;
  } | null;
}

export default function EditMealModal({ isOpen, onClose, itemData }: EditProps) {
  if (!isOpen || !itemData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Edit <span className="text-orange-500">Item</span>
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Update your meal details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Item Name</label>
            <input 
              type="text" 
              defaultValue={itemData.name}
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none focus:border-orange-500 transition text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-orange-500">Calories (kcal)</label>
                <input type="number" defaultValue={itemData.kcal} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none text-sm" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-blue-400">Protein (g)</label>
                <input type="text" defaultValue={itemData.p.replace('g', '')} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none text-sm" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-green-500">Carbs (g)</label>
                <input type="text" defaultValue={itemData.c.replace('g', '')} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none text-sm" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-yellow-600">Fats (g)</label>
                <input type="text" defaultValue={itemData.f.replace('g', '')} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none text-sm" />
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 mt-10">
          <button className="flex-1 py-4 bg-zinc-800 hover:bg-red-900/20 hover:text-red-500 hover:border-red-900/50 border border-transparent rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
          <button onClick={onClose} className="flex-[2] py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}