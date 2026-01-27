'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Utensils, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getRecipeDetails } from '@/app/actions/recipes';
import RecipeLogCard from '@/app/components/RecipeLogCard';

// --- INTERFACES ---
// Dessa definierar strukturen på den komplexa data vi får från Spoonacular API via vår Server Action.
interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}
interface Ingredient {
  original: string;
}
interface Step {
  number: number;
  step: string;
}
interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  nutrition: { nutrients: Nutrient[] };
  extendedIngredients: Ingredient[];
  analyzedInstructions: { steps: Step[] }[];
}

export default function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // States för receptdata samt interaktiva listor (checka av ingredienser/steg)
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  // Hämtar detaljerad info om det specifika receptet baserat på ID i URL:en
  useEffect(() => {
    const init = async () => {
      try {
        const resolvedParams = await params;
        const data = await getRecipeDetails(resolvedParams.id);
        if (data) {
          setRecipe(data as Recipe);
        } else {
          console.error('No data returned for recipe');
        }
      } catch (err) {
        console.error('Failed to load recipe details', err);
      }
    };
    init();
  }, [params]);

  // Loading-state som visas medan API-anropet körs
  if (!recipe)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center italic font-black uppercase tracking-widest text-orange-500 animate-pulse">
        Loading Recipe...
      </div>
    );

  // --- NUTRITION LOGIC ---
  // API:et skickar en lång lista med näringsämnen. Vi letar upp de specifika värden vi behöver.
  const findNutrient = (name: string) =>
    recipe.nutrition?.nutrients?.find((n) => n.name === name);
  const p = Math.round(findNutrient('Protein')?.amount || 0);
  const c = Math.round(
    findNutrient('Net Carbohydrates')?.amount ||
      findNutrient('Carbohydrates')?.amount ||
      0,
  );
  const f = Math.round(findNutrient('Fat')?.amount || 0);
  const kcal = Math.round(findNutrient('Calories')?.amount || 0);

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <main className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10 text-left">
          <Link
            href="/nutrition/recipe"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} /> Back to Search
          </Link>
        </div>

        {/* HERO SECTION: Visar receptets bild och snabbinfo (tid/portioner) */}
        <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden mb-12 border border-zinc-800/50 shadow-2xl">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 text-left">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-6 max-w-2xl">
              {recipe.title}
            </h1>
            <div className="flex gap-4 uppercase font-black text-[10px] tracking-widest">
              <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />{' '}
                {recipe.readyInMinutes} MIN
              </div>
              <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-2">
                <Utensils size={16} className="text-orange-500" />{' '}
                {recipe.servings} SERVINGS
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {/* INGREDIENSLISTA: Med inbyggd check-funktion för användarvänlighet */}
          <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800/50 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 px-1 italic text-left">
              The Fuel Stack
            </h3>
            <div className="space-y-3">
              {recipe.extendedIngredients?.map((ing, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setCheckedIngredients((prev) =>
                      prev.includes(ing.original)
                        ? prev.filter((i) => i !== ing.original)
                        : [...prev, ing.original],
                    )
                  }
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${checkedIngredients.includes(ing.original) ? 'bg-orange-500/5 border-orange-500/20 opacity-40' : 'bg-black/20 border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${checkedIngredients.includes(ing.original) ? 'bg-orange-500 border-orange-500' : 'border-zinc-700'}`}
                  >
                    {checkedIngredients.includes(ing.original) && (
                      <Check size={12} strokeWidth={4} className="text-white" />
                    )}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-zinc-300">
                    {ing.original}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LOGGNINGSKORT: En separat komponent som hanterar sparande av måltiden till användarens dagbok */}
          <div className="flex flex-col h-full text-left">
            <RecipeLogCard
              title={recipe.title}
              totalKcal={kcal}
              totalProtein={p}
              totalCarbs={c}
              totalFat={f}
              recipeServings={recipe.servings}
            />
          </div>
        </div>

        {/* INSTRUKTIONER: Steg-för-steg-guide med visuell feedback när ett steg är klart */}
        <div className="text-left">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 px-4">
            The <span className="text-orange-500">Method</span>
          </h2>
          <div className="space-y-6">
            {recipe.analyzedInstructions?.[0]?.steps.map((step) => (
              <div
                key={step.number}
                onClick={() =>
                  setCompletedSteps((prev) =>
                    prev.includes(step.number)
                      ? prev.filter((s) => s !== step.number)
                      : [...prev, step.number],
                  )
                }
                className={`p-10 rounded-[3rem] border transition-all cursor-pointer group flex gap-10 items-start ${completedSteps.includes(step.number) ? 'bg-zinc-900/20 border-zinc-900 opacity-40' : 'bg-zinc-900/40 border-zinc-800 hover:border-orange-500/50'}`}
              >
                <span
                  className={`text-5xl font-black italic leading-none ${completedSteps.includes(step.number) ? 'text-zinc-800' : 'text-orange-500/20 group-hover:text-orange-500/40'}`}
                >
                  {step.number.toString().padStart(2, '0')}
                </span>
                <p
                  className={`text-lg font-medium leading-relaxed flex-1 ${completedSteps.includes(step.number) ? 'text-zinc-600' : 'text-zinc-300'}`}
                >
                  {step.step}
                </p>
                <div
                  className={`mt-2 p-3 rounded-full border transition-all ${completedSteps.includes(step.number) ? 'bg-orange-600 border-orange-600 text-white' : 'border-zinc-800 text-transparent'}`}
                >
                  <Check size={20} strokeWidth={4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
