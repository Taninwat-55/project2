'use client'; 

import { useState, useEffect } from 'react';
import { X, Plus, Zap, ClipboardList } from 'lucide-react';
import {
  getMealTemplates,
  logMealFromTemplate,
  logMeal,
} from '@/app/actions/nutrition';

// --- TYPER & INTERFACES ---
// RawTemplate representerar datan direkt från databasen (där värden kan vara null)
interface RawTemplate {
  id: string;
  name: string;
  total_kcal: number | null;
  total_p: number | null;
  total_c: number | null;
  total_f: number | null;
}

// Template representerar den "städade" datan vi använder i komponenten
interface Template {
  id: string;
  name: string;
  total_kcal: number;
  total_p: number;
  total_c: number;
  total_f: number;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface QuickAddModalProps {
  isOpen: boolean; // Styr om modalen syns
  onClose: () => void; // Funktion för att stänga modalen
  onAdded: () => void; // Funktion som körs efter lyckad loggning (för att uppdatera listor i bakgrunden)
  mealType: MealType; // Vilken måltidstyp vi loggar för just nu
}

export default function QuickAddModal({
  isOpen,
  onClose,
  onAdded,
  mealType,
}: QuickAddModalProps) {
  // --- STATES ---
  // Styr vilken flik som är aktiv: "templates" (mallar) eller "manual" (manuell inmatning)
  const [activeTab, setActiveTab] = useState<'templates' | 'manual'>(
    'templates',
  );
  const [templates, setTemplates] = useState<Template[]>([]); // Sparar hämtade mallar
  const [loading, setLoading] = useState(false); // Visar laddnings-snurra vid hämtning

  // State för formuläret i den manuella fliken
  const [manualData, setManualData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // --- HÄMTA MALLAR (EFFECT) ---
  // Körs varje gång modalen öppnas ELLER när användaren byter till mall-fliken
  useEffect(() => {
    if (isOpen && activeTab === 'templates') {
      const loadTemplates = async () => {
        setLoading(true);
        try {
          const data = await getMealTemplates();
          // DATA-STÄDNING: Mappar om databas-svar och ersätter 'null' med 0 för säker beräkning
          const formattedData: Template[] = (
            (data as unknown as RawTemplate[]) || []
          ).map((item) => ({
            id: item.id,
            name: item.name,
            total_kcal: item.total_kcal ?? 0,
            total_p: item.total_p ?? 0,
            total_c: item.total_c ?? 0,
            total_f: item.total_f ?? 0,
          }));
          setTemplates(formattedData);
        } catch (error) {
          console.error('Error loading templates:', error);
        } finally {
          setLoading(false);
        }
      };
      loadTemplates();
    }
  }, [isOpen, activeTab]);

  // --- HANDLERS ---

  // Logga en måltid baserat på en sparad mall
  const handleTemplateAdd = async (template: Template) => {
    const res = await logMealFromTemplate(
      {
        name: template.name,
        total_kcal: template.total_kcal,
        total_protein: template.total_p,
        total_carbs: template.total_c,
        total_fat: template.total_f,
      },
      mealType,
    );
    if (res.success) {
      onAdded(); // Refreshar datan i appen
      onClose(); // Stänger modalen
    }
  };

  // Logga en måltid med helt egna värden
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Förhindrar att sidan laddas om
    const res = await logMeal({
      name: manualData.name,
      type: mealType,
      // Konverterar strängar från input-fälten till nummer
      calories: Number(manualData.calories),
      protein: Number(manualData.protein),
      carbs: Number(manualData.carbs),
      fat: Number(manualData.fat),
    });

    if (res.success) {
      // Nollställ formuläret efter lyckad loggning
      setManualData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
      });
      onAdded();
      onClose();
    }
  };

  // Om modalen inte ska vara öppen, rendera ingenting
  if (!isOpen) return null;

  return (
    // Backdrop: Mörk bakgrund med blur-effekt
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* HEADER & FLIKAR */}
        <div className="p-8 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                Quick <span className="text-orange-500">Add</span>
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Logging {mealType}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-900 rounded-full transition text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* FLIK-SYSTEM (Segmented Control) */}
          <div className="flex bg-zinc-900 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              <ClipboardList size={14} /> Templates
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              <Zap size={14} /> Manual
            </button>
          </div>
        </div>

        {/* INNEHÅLLSYTA (Scrollbar om listan är lång) */}
        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
          {activeTab === 'templates' ? (
            <div className="grid gap-3">
              {/* LADDNINGS-VY */}
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                    Scanning templates...
                  </p>
                </div>
              ) : templates.length === 0 ? (
                <div className="py-20 text-center px-6">
                  <p className="text-zinc-500 text-sm italic">
                    No templates found. Save a meal as a template to see it
                    here.
                  </p>
                </div>
              ) : (
                // LISTA ÖVER MALLAR
                templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateAdd(t)}
                    className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[1.5rem] flex justify-between items-center hover:border-orange-500/50 hover:bg-zinc-900 transition-all text-left group active:scale-95"
                  >
                    <div>
                      <span className="block font-bold text-white group-hover:text-orange-500 transition-colors">
                        {t.name}
                      </span>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] text-blue-400 font-black uppercase tracking-tighter">
                          P: {t.total_p}g
                        </span>
                        <span className="text-[9px] text-green-500 font-black uppercase tracking-tighter">
                          C: {t.total_c}g
                        </span>
                        <span className="text-[9px] text-yellow-600 font-black uppercase tracking-tighter">
                          F: {t.total_f}g
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white">
                        {t.total_kcal}{' '}
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                          kcal
                        </span>
                      </span>
                      <div className="bg-orange-500/10 p-2 rounded-full text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Plus size={14} />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            // MANUELLT FORMULÄR
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block tracking-widest">
                  Meal Name
                </label>
                <input
                  required
                  value={manualData.name}
                  onChange={(e) =>
                    setManualData({ ...manualData, name: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 transition text-white"
                  placeholder="e.g. Protein Shake"
                />
              </div>

              {/* GRUPPERAT OMRÅDE FÖR MAKROS */}
              <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-900 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-2 mb-1 block tracking-widest text-orange-500">
                    Total Calories
                  </label>
                  <input
                    type="number"
                    required
                    value={manualData.calories}
                    onChange={(e) =>
                      setManualData({ ...manualData, calories: e.target.value })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-blue-400 uppercase text-center mb-1 block">
                      Prot (g)
                    </label>
                    <input
                      type="number"
                      required
                      value={manualData.protein}
                      onChange={(e) =>
                        setManualData({
                          ...manualData,
                          protein: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-blue-400 transition text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-green-500 uppercase text-center mb-1 block">
                      Carb (g)
                    </label>
                    <input
                      type="number"
                      required
                      value={manualData.carbs}
                      onChange={(e) =>
                        setManualData({ ...manualData, carbs: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-green-500 transition text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-yellow-600 uppercase text-center mb-1 block">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      required
                      value={manualData.fat}
                      onChange={(e) =>
                        setManualData({ ...manualData, fat: e.target.value })
                      }
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-yellow-600 transition text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-black uppercase italic py-5 rounded-[1.5rem] mt-4 hover:bg-orange-500 transition shadow-lg shadow-orange-950/20 active:scale-95"
              >
                Log to {mealType}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
