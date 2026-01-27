"use server";

// --- TYPER ---

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
 * Hämtar slumpmässiga recept för "Recommended Fuel" sektionen
 */
export async function getRandomRecipes(number = 3) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  // Vi lägger till addRecipeNutrition=true för att få makros direkt
  const url = `https://api.spoonacular.com/recipes/random?number=${number}&tags=main+course&apiKey=${apiKey}&addRecipeNutrition=true`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error("Misslyckades att hämta slumpmässiga recept");

    const data = await res.json();
    return data.recipes || [];
  } catch (error) {
    console.error("Error in getRandomRecipes:", error);
    return [];
  }
}

/**
 * Hämtar en lista med recept baserat på sökning och filter
 */
export async function searchRecipes(query: string, category: string, sortBy: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const baseUrl = "https://api.spoonacular.com/recipes/complexSearch";
  
  const params = new URLSearchParams({
    apiKey: apiKey!,
    query: query || "healthy", 
    addRecipeNutrition: 'true',
    number: '9'
  });

  if (category !== 'All') {
    params.append('type', category.toLowerCase());
  }

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
  
  console.log("Fetching recipe details for ID:", id);
  console.log("Using API Key:", apiKey ? "FOUND" : "MISSING");

  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`;

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      // Om status är 402 betyder det att poängen är slut
      // Om status är 401 är nyckeln felaktig
      console.error(`Spoonacular API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch recipe with id: ${id}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getRecipeDetails:", error);
    throw error;
  }
}