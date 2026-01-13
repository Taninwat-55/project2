'use client';

import React, { useState } from 'react';
import { Search, Utensils, Clock, Flame, ChevronRight, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

// Mock-data för designens skull
const MOCK_RECIPES = [
  {
    id: "salmon-bowl",
    title: "Honey Glazed Salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80",
    kcal: 520,
    time: 25,
    protein: "35g"
  },
  {
    id: "garlic-pasta",
    title: "Creamy Garlic Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
    kcal: 450,
    time: 20,
    protein: "15g"
  },
  {
    id: "chicken-salad",
    title: "Grilled Chicken Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
    kcal: 380,
    time: 15,
    protein: "28g"
  }
];

export default function RecipeSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Sortering state
  const [sortBy, setSortBy] = useState('Relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegan'];
  const sortOptions = ['Relevance', 'Most Protein', 'Lowest Calories', 'Fastest'];

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
            placeholder="Search for pasta, chicken, breakfast..."
            className="w-full bg-zinc-900/40 border border-zinc-800 p-7 pl-16 rounded-[2rem] text-xl focus:outline-none focus:border-orange-500/50 transition-all backdrop-blur-md placeholder:text-zinc-700"
          />
          <button className="absolute right-4 top-3 bottom-3 bg-orange-600 hover:bg-orange-500 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-900/20 text-white">
            Search
          </button>
        </div>
      </div>

      {/* --- FILTRERING & SORTERING --- */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-wrap items-center justify-between gap-6">
        {/* Kategorier */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
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

        {/* Sortering Dropdown */}
        <div className="relative flex items-center gap-4">
          <div className="h-8 w-[1px] bg-zinc-800 hidden md:block" />
          
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-600 transition group"
            >
              <SlidersHorizontal size={14} className={isSortOpen ? 'text-orange-500' : ''} />
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
                {/* Overlay för att stänga vid klick utanför */}
                <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
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
            {searchQuery ? `Showing results for "${searchQuery}"` : "Recommended Recipes"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_RECIPES.map((recipe) => (
            <div 
              key={recipe.id} 
              className="group bg-zinc-900/20 border border-zinc-800/50 rounded-[3rem] overflow-hidden hover:bg-zinc-900/40 transition-all hover:translate-y-[-5px]"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                   <h4 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight">{recipe.title}</h4>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Energy</span>
                    <div className="flex items-center gap-1 text-orange-500 font-bold tracking-tighter text-sm">
                      <Flame size={14} /> {recipe.kcal} KCAL
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Cook Time</span>
                    <div className="flex items-center gap-1 text-zinc-300 font-bold tracking-tighter text-sm">
                      <Clock size={14} /> {recipe.time} MIN
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/nutrition/recipe/${recipe.id}`}
                  className="w-full py-5 bg-zinc-800/40 hover:bg-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn border border-zinc-800 hover:border-orange-500"
                >
                  View Details
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* --- TOMT LÄGE --- */}
        {searchQuery === '' && (
          <div className="mt-20 p-24 border-2 border-dashed border-zinc-900 rounded-[4rem] flex flex-col items-center justify-center opacity-40">
            <div className="bg-zinc-900 p-6 rounded-full mb-6 text-zinc-700">
              <Utensils size={40} />
            </div>
            <p className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em]">Search to discover more meals</p>
          </div>
        )}
      </div>
    </div>
  );
}