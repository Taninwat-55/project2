'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Utensils,
  Flame,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { searchRecipes } from '@/app/actions/recipes';

// --- TYP-DEFINITIONER ---
// Ett Interface säkerställer att alla recept-objekt följer exakt samma struktur.
// Detta förhindrar buggar där man försöker läsa data som inte finns.
interface Recipe {
  id: number;
  title: string;
  image: string;
  kcal: number;
  protein: string;
  time: number;
}

export default function RecipeSearchPage() {
  // --- STATES ---
  // Håller koll på användarens valda filter, sökord och om datan laddas just nu.
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Här lagras resultaten från databasen/API:et.
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Filteralternativ som används för att bygga menyn dynamiskt
  const categories = [
    'All',
    'Breakfast',
    'Main Course',
    'Side Dish',
    'Dessert',
    'Salad',
  ];
  const sortOptions = [
    'Relevance',
    'Most Protein',
    'Lowest Calories',
    'Fastest',
  ];

  // --- LOGIK FÖR DATAHÄMTNING ---
  // useCallback memoiserar funktionen. Det betyder att den bara skapas om på nytt
  // om [searchQuery, activeCategory, sortBy] ändras. Det förhindrar oändliga loopar i useEffect.
  const fetchRecipes = useCallback(async () => {
    setLoading(true); // Visa laddnings-snurran
    try {
      // Vi skickar filtervalen direkt till vår Server Action
      const results = await searchRecipes(searchQuery, activeCategory, sortBy);
      setRecipes(results || []); // Spara resultaten i vårt state
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false); // Ta bort laddnings-snurran
    }
  }, [searchQuery, activeCategory, sortBy]);

  // Kör sökningen automatiskt varje gång användaren ändrar kategori eller sortering
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* --- NAVIGATION --- */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link
          href="/nutrition"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* --- HEADER SEKTION --- */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-4 uppercase">
          Search <span className="text-orange-500">Recipes</span>
        </h1>
        <p className="text-zinc-500 font-normal max-w-2xl leading-relaxed">
          Fuel your body with professional recipes. Use the search below to find
          meals based on ingredients or dish names.
        </p>
      </div>

      {/* --- SÖKFÄLT --- */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-orange-500 transition-colors">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Gör så att sökningen triggas när man trycker på Enter
            onKeyDown={(e) => e.key === 'Enter' && fetchRecipes()}
            placeholder="Search for pasta, chicken, breakfast..."
            className="w-full bg-zinc-900/40 border border-zinc-800 p-7 pl-16 rounded-[2rem] text-xl focus:outline-none focus:border-orange-500/50 transition-all backdrop-blur-md placeholder:text-zinc-700"
          />
          <button
            onClick={fetchRecipes}
            disabled={loading}
            className="absolute right-4 top-3 bottom-3 bg-orange-600 hover:bg-orange-500 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-900/20 text-white flex items-center justify-center min-w-[140px]"
          >
            {/* Visar en snurra om vi väntar på svar från servern */}
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* --- FILTRERING & SORTERING --- */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {/* Mappar ut kategoriknappar. Den knapp som matchar activeCategory får vit färg. */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                  : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdown för sortering */}
        <div className="relative flex items-center gap-4">
          <div className="h-8 w-[1px] bg-zinc-800 hidden md:block" />
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-600 transition group"
            >
              <SlidersHorizontal
                size={14}
                className={isSortOpen ? 'text-orange-500' : ''}
              />
              Sort By: <span className="text-orange-500 ml-1">{sortBy}</span>
            </button>

            {isSortOpen && (
              <>
                <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest transition-colors ${
                        sortBy === option
                          ? 'bg-orange-600 text-white'
                          : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {/* Overlay som stänger dropdownen om man klickar utanför */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSortOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- RECEPT GRID --- */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 px-2 border-b border-zinc-800 pb-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
            <Utensils size={14} />
            {loading
              ? 'Searching recipes...'
              : searchQuery
                ? `Showing results for "${searchQuery}"`
                : 'Recommended Recipes'}
          </h3>
        </div>

        {/* Här ritas alla hittade recept ut i ett rutnät */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group bg-zinc-900/20 border border-zinc-800/50 rounded-[3rem] overflow-hidden hover:bg-zinc-900/40 transition-all hover:translate-y-[-5px]"
            >
              {/* Bildbehandling med Next.js Image-komponent för optimerad laddning */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <h4 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight line-clamp-2">
                    {recipe.title}
                  </h4>
                </div>
              </div>

              {/* Kortinformation: Kalorier och Protein */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                      Energy
                    </span>
                    <div className="flex items-center gap-1 text-orange-500 font-bold tracking-tighter text-sm uppercase">
                      <Flame size={14} /> {recipe.kcal} kcal
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                      Protein
                    </span>
                    <div className="flex items-center gap-1 text-zinc-300 font-bold tracking-tighter text-sm uppercase">
                      <Utensils size={14} /> {recipe.protein}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/nutrition/recipe/${recipe.id}`}
                  className="w-full py-5 bg-zinc-800/40 hover:bg-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn border border-zinc-800 hover:border-orange-500"
                >
                  View Details
                  <ChevronRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State: Visas om sökningen inte gav några träffar */}
        {!loading && recipes.length === 0 && (
          <div className="mt-20 p-24 border-2 border-dashed border-zinc-900 rounded-[4rem] flex flex-col items-center justify-center opacity-40">
            <div className="bg-zinc-900 p-6 rounded-full mb-6 text-zinc-700">
              <Utensils size={40} />
            </div>
            <p className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em]">
              No recipes found. Try another search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
