'use client';

import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { updateMealLog } from '@/app/actions/nutrition';

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
  itemData: {
    id: string;
    name: string;
    kcal: number;
    p: string;
    c: string;
    f: string;
  } | null;
}

export default function EditMealModal({ isOpen, onClose, onDelete, onUpdate, itemData }: EditProps) {
  // Vi initierar state direkt. Eftersom vi använder 'key' i page.tsx 
  // kommer denna komponent att skapas på nytt varje gång vi öppnar ett nytt item.
  const [formData, setFormData] = useState({
    name: itemData?.name || '',
    kcal: itemData?.kcal || 0,
    p: itemData?.p?.replace('g', '') || '',
    c: itemData?.c?.replace('g', '') || '',
    f: itemData?.f?.replace('g', '') || ''
  });

  if (!isOpen || !itemData) return null;

  const handleSave = async () => {
    const result = await updateMealLog(itemData.id, {
      name: formData.name,
      calories: Number(formData.kcal),
      protein_g: Number(formData.p),
      carbs_g: Number(formData.c),
      fat_g: Number(formData.f)
    });

    if (result.success) {
      onUpdate();
      onClose();
    } else {
      alert("Fel vid sparande: " + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Edit <span className="text-orange-500">Item</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Update your meal details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block tracking-widest">Item Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none focus:border-orange-500 transition text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-orange-500 tracking-widest">Calories (kcal)</label>
                <input 
                  type="number" 
                  value={formData.kcal}
                  onChange={(e) => setFormData({ ...formData, kcal: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none focus:border-orange-500 transition text-sm text-white" 
                />
             </div>
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-blue-400 tracking-widest">Protein (g)</label>
                <input 
                  type="text" 
                  value={formData.p}
                  onChange={(e) => setFormData({ ...formData, p: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none transition text-sm text-white" 
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-green-500 tracking-widest">Carbs (g)</label>
                <input 
                  type="text" 
                  value={formData.c}
                  onChange={(e) => setFormData({ ...formData, c: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none transition text-sm text-white" 
                />
             </div>
             <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block text-yellow-600 tracking-widest">Fats (g)</label>
                <input 
                  type="text" 
                  value={formData.f}
                  onChange={(e) => setFormData({ ...formData, f: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none transition text-sm text-white" 
                />
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-10">
          <button 
            type="button"
            onClick={() => onDelete(itemData.id)}
            className="flex-1 py-4 bg-zinc-800 hover:bg-red-900/20 hover:text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button 
            type="button"
            onClick={handleSave} 
            className="flex-[2] py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 text-white shadow-lg"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}