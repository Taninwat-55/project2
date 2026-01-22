"use server";

// Definiera typer för Spoonacular-svar
interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
    }>;
  };
}

export async function searchRecipes(query: string, category: string, sortBy: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";
  
  const params = new URLSearchParams({
    apiKey: apiKey!,
    query: query || "healthy",
    type: category === 'All' ? '' : category,
    addRecipeNutrition: 'true',
    number: '9'
  });

  // Fixar varningen 'sortBy is defined but never used' genom att applicera logiken
  if (sortBy === 'Most Protein') params.append('sort', 'protein');
  else if (sortBy === 'Lowest Calories') params.append('sort', 'calories');
  else if (sortBy === 'Fastest') params.append('sort', 'readyTime');

  const res = await fetch(`${baseUrl}?${params.toString()}`);
  const data = await res.json();

  // Mappa med typer istället för any
  return data.results?.map((r: SpoonacularRecipe) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    kcal: Math.round(r.nutrition?.nutrients.find((n) => n.name === "Calories")?.amount || 0),
    protein: Math.round(r.nutrition?.nutrients.find((n) => n.name === "Protein")?.amount || 0) + "g",
    time: r.readyInMinutes
  })) || [];
}