'use client';
import Link from 'next/link';
import {
  Clock,
  Flame,
  Beef,
  UtensilsCrossed,
  BookOpen,
  Plus,
  ChevronLeft,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// CONFIGURATION & DATA 
const recipeData = {
  title: 'Grilled Salmon Bowl',
  description:
    'A high-protein, omega-3 rich dinner perfect for post-workout recovery. Simple, clean, and ready under 40 min.',
  stats: [
    { label: '20 min', icon: <Clock className="w-4 h-4 text-orange-500" /> },
    { label: '580 kcal', icon: <Flame className="w-4 h-4 text-orange-500" /> },
    {
      label: 'High Protein',
      icon: <Beef className="w-4 h-4 text-orange-500" />,
    },
  ],
  ingredients: [
    { name: 'Salmon Fillet', amount: '170g' },
    { name: 'Brown Rice (cooked)', amount: '200g' },
    { name: 'Avocado (sliced)', amount: '80g' },
    { name: 'Cucumber (diced)', amount: '75g' },
    { name: 'Soy Sauce', amount: '15g' },
    { name: 'Sesame Seeds', amount: '3g' },
  ],
  instructions: [
    {
      step: 1,
      title: 'Season the salmon',
      text: 'Pat the salmon fillet dry with a paper towel. Season liberally with salt, black pepper, and a fresh squeeze of lemon juice. Let it sit for 2 minutes.',
    },
    {
      step: 2,
      title: 'Heat the pan',
      text: 'Heat a non-stick pan over medium-high heat. Add a light spray of olive oil or avocado oil. Wait until the oil shimmers slightly.',
    },
    {
      step: 3,
      title: 'Cook the salmon',
      text: 'Place the salmon skin-side down. Cook for 4-5 minutes until the skin is crispy. Flip gently and cook for another 2-3 minutes.',
    },
    {
      step: 4,
      title: 'Assemble the bowl',
      text: 'Start with a base of warm brown rice. Top with the cooked salmon, sliced avocado, and diced cucumber.',
    },
    {
      step: 5,
      title: 'Garnish and serve',
      text: 'Drizzle the soy sauce over the bowl. Sprinkle with sesame seeds for crunch. Serve immediately while warm.',
    },
  ],
};

// CHART UTILS
const macroOptions = {
  plugins: { tooltip: { enabled: false }, legend: { display: false } },
  responsive: true,
  maintainAspectRatio: true,
  cutout: '80%',
};

const chartData = {
  datasets: [
    {
      data: [35, 40, 25], // P / C / F split
      backgroundColor: ['#206A9E', '#51A255', '#C7831F'],
      borderWidth: 0,
      borderRadius: 10,
    },
  ],
};

// MAIN COMPONENT 
export default function RecipePage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30 pb-20">
      <main className="max-w-5xl mx-auto px-8">

        {/* Back Button & Header */}
        <div className="pt-12 mb-10">
          <Link
            href="/nutrition"
            className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Nutrition
          </Link>
          <h1 className="text-6xl font-black mb-4 tracking-tighter">
            {recipeData.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed mb-8">
            {recipeData.description}
          </p>

          <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-300 bg-zinc-900/30 w-fit px-8 py-4 rounded-3xl border border-zinc-800/50">
            {recipeData.stats.map((stat, i) => (
              <span key={i} className="flex items-center gap-2">
                {stat.icon} {stat.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT COLUMN: Ingredients */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800/50">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <UtensilsCrossed className="w-6 h-6 text-orange-500" />{' '}
                Ingredients
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {recipeData.ingredients.map((item) => (
                  <label
                    key={item.name}
                    className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-zinc-800/50 cursor-pointer hover:border-zinc-600 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border-zinc-700 bg-zinc-800 checked:bg-orange-500 transition-all cursor-pointer"
                      />
                      <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-zinc-500 font-mono text-sm">
                      {item.amount}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Instructions (Below Ingredients in Left Col) */}
            <div className="mt-12 bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800/50">
              <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-orange-500" /> Instructions
              </h2>
              <div className="space-y-12 relative">
                {/* Visual Line */}
                <div className="absolute left-[23px] top-4 bottom-4 w-px bg-zinc-800" />

                {recipeData.instructions.map((step) => (
                  <div key={step.step} className="relative flex gap-10">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-orange-900/20">
                      {step.step}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-xl mb-3 text-white">
                        {step.title}
                      </h4>
                      <p className="text-zinc-400 leading-relaxed text-sm max-w-xl">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800/50 flex flex-col items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-10">
                  Item Preview
                </h3>
                <div className="relative w-48 h-48 mb-10">
                  <Doughnut data={chartData} options={macroOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">540</span>
                    <span className="text-[10px] font-black text-zinc-500 mt-1 tracking-widest">
                      KCAL
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-3 mb-10">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span>Protein</span>{' '}
                    <span className="text-blue-500">35g</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 border-t border-zinc-800/50 pt-3">
                    <span>Carbs</span>{' '}
                    <span className="text-green-500">40g</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 border-t border-zinc-800/50 pt-3">
                    <span>Fats</span>{' '}
                    <span className="text-yellow-500">12g</span>
                  </div>
                </div>

                <button className="w-full bg-orange-600 hover:bg-orange-500 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3">
                  <Plus className="w-5 h-5" /> Log This Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
