"use server";

// --- TYPER FÖR ATT SLIPPA 'ANY' ---

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

// --- FUNKTIONER ---

/**
 * Hämtar en lista med recept baserat på sökning och filter
 */
export async function searchRecipes(query: string, category: string, sortBy: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";
  
  const params = new URLSearchParams({
    apiKey: apiKey!,
    query: query || "healthy", // Standard sökning om fältet är tomt
    addRecipeNutrition: 'true',
    number: '9'
  });

  // Lägg till kategori om en annan än 'All' är vald
  if (category !== 'All') {
    params.append('type', category.toLowerCase());
  }

  // Sorteringslogik
  if (sortBy === 'Most Protein') params.append('sort', 'protein');
  else if (sortBy === 'Lowest Calories') params.append('sort', 'calories');
  else if (sortBy === 'Fastest') params.append('sort', 'readyTime');

  try {
    const res = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!res.ok) {
      console.error("Spoonacular API error:", res.status);
      return [];
    }

    const data = await res.json();

    return data.results?.map((r: SpoonacularRecipe) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      kcal: Math.round(r.nutrition?.nutrients.find((n) => n.name === "Calories")?.amount || 0),
      protein: Math.round(r.nutrition?.nutrients.find((n) => n.name === "Protein")?.amount || 0) + "g",
      time: r.readyInMinutes
    })) || [];

  } catch (error) {
    console.error("Fetch error in searchRecipes:", error);
    return [];
  }
}

/**
 * Hämtar all detaljerad information om ett specifikt recept via ID
 */
export async function getRecipeDetails(id: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`;

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch recipe with id: ${id}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getRecipeDetails:", error);
    throw error;
  }
}