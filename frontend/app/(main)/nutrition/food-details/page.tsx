'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import LogMealModal from '@/app/components/LogMealModal';
import EditMealModal from '@/app/components/EditMealModal';

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

export default function DinnerDetailsPage() {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  // LOGIK: Använd useState för listan så att den kan uppdateras
  const [loggedItems, setLoggedItems] = useState<FoodItem[]>([
    { name: 'Grilled Salmon', type: 'HOMEMADE', amount: '1 fillet (200g)', kcal: 412, p: '40g', c: '0g', f: '28g' },
    { name: 'Quinoa Salad', type: 'SIDE DISH', amount: '1 cup', kcal: 220, p: '8g', c: '40g', f: '4g' },
  ]);

  // Funktion för att lägga till nytt objekt från modalen
  const handleAddItem = (newItem: FoodItem) => {
    setLoggedItems([...loggedItems, newItem]);
  };

  // Funktion för att ta bort objekt
  const handleDelete = (name: string) => {
    setLoggedItems(loggedItems.filter(item => item.name !== name));
  };

  const macroOptions = {
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
    cutout: '80%',
  };

  const createMacroData = (current: number, goal: number, color: string) => ({
    datasets: [
      {
        data: [current, Math.max(0, goal - current)],
        backgroundColor: [color, '#18181b'],
        borderWidth: 0,
        borderRadius: 20,
        circumference: 360,
      },
    ],
  });

  // Beräkna totaler för graferna dynamiskt
  const totalKcal = loggedItems.reduce((acc, item) => acc + item.kcal, 0);
  const remainingKcal = Math.max(0, 1000 - totalKcal);

  const mealMacros = [
    { label: 'Calories', val: totalKcal, goal: 1000, unit: 'kcal', color: '#f97316', footerLabel: 'Remaining', footerVal: remainingKcal.toString() },
    { label: 'Protein', val: loggedItems.reduce((acc, item) => acc + parseInt(item.p), 0), goal: 92, unit: 'g', color: '#206A9E', footerLabel: 'Status', footerVal: 'High' },
    { label: 'Carbs', val: loggedItems.reduce((acc, item) => acc + parseInt(item.c), 0), goal: 177, unit: 'g', color: '#51A255', footerLabel: 'Target', footerVal: 'Near' },
    { label: 'Fats', val: loggedItems.reduce((acc, item) => acc + parseInt(item.f), 0), goal: 83, unit: 'g', color: '#C7831F', footerLabel: 'Balance', footerVal: 'Good' },
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30">
      <main className="max-w-6xl mx-auto p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <Link href="/nutrition" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-widest">
              <ChevronLeft size={16} /> Back
            </Link>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">
              Dinner <span className="text-orange-500">Details</span>
            </h1>
            <p className="text-zinc-500 flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
              <Calendar size={14} /> Today, December 17
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsLogOpen(true)}
              className="px-8 py-4 bg-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-orange-500 transition active:scale-95 shadow-lg shadow-orange-900/20"
            >
              <Plus size={16} /> Log Meal
            </button>
          </div>
        </div>

        {/* Macro Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mealMacros.map((m) => (
            <div key={m.label} className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col items-center">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 self-start mb-8">{m.label}</h2>
              <div className="relative w-36 h-36 mb-8">
                <Doughnut data={createMacroData(m.val, m.goal, m.color)} options={macroOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{Math.round((m.val / m.goal) * 100)}%</span>
                  <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">{m.val}{m.unit}</span>
                </div>
              </div>
              <div className="w-full space-y-3 pt-4 border-t border-zinc-800/50">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-black">
                  <span className="text-zinc-600">Goal</span>
                  <span>{m.goal} {m.unit}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-black">
                  <span className="text-zinc-600">{m.footerLabel}</span>
                  <span style={{ color: m.color }}>{m.footerVal} {m.unit === 'kcal' ? 'kcal' : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Goal Progress Banner */}
        <div className="bg-orange-600 rounded-[2.5rem] p-10 mb-12 relative overflow-hidden shadow-2xl shadow-orange-900/20">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-black mb-1 uppercase tracking-tight">Dinner Progress</h3>
              <p className="text-orange-100/80 text-sm font-medium">You have {remainingKcal} kcal remaining for dinner.</p>
            </div>
            <div className="text-4xl font-black italic">
              {totalKcal} <span className="text-orange-200 text-xl not-italic font-bold">/ 1000 kcal</span>
            </div>
          </div>
          <div className="h-4 bg-orange-900/30 rounded-full overflow-hidden border border-orange-400/20">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${(totalKcal/1000)*100}%` }} />
          </div>
        </div>

        {/* Logged Items */}
        <h2 className="text-2xl font-bold mb-8">Logged Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loggedItems.map((item, index) => (
            <div key={index} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 hover:bg-zinc-800/30 transition group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <button onClick={() => {setSelectedItem(item); setIsEditOpen(true);}} className="text-zinc-600 hover:text-white transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.name)} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-zinc-500 block uppercase">{item.type}</span>
                  <span className="text-xs text-zinc-500">{item.amount}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black block leading-none">{item.kcal}</span>
                  <span className="text-[10px] font-black text-orange-500 uppercase">kcal</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-zinc-800/50 pt-6">
                <div className="text-center">
                  <span className="block text-[9px] font-black text-zinc-500 uppercase mb-1">Prot</span>
                  <span className="text-sm font-bold text-blue-400">{item.p}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] font-black text-zinc-500 uppercase mb-1">Carb</span>
                  <span className="text-sm font-bold text-green-500">{item.c}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] font-black text-zinc-500 uppercase mb-1">Fat</span>
                  <span className="text-sm font-bold text-yellow-600">{item.f}</span>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsLogOpen(true)}
            className="border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-zinc-600 hover:text-white hover:border-zinc-700 transition min-h-[220px] group"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3 group-hover:scale-110 transition group-hover:bg-zinc-800">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Add Item</span>
          </button>
        </div>
      </main>

      <LogMealModal 
        isOpen={isLogOpen} 
        onClose={() => setIsLogOpen(false)} 
        onAdd={handleAddItem}
      />

      <EditMealModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        itemData={selectedItem}
      />
    </div>
  );
}