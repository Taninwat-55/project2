'use server'; // Viktigt: Säger till Next.js att dessa funktioner endast får köras på servern

// --- TYPER ---
// Definierar strukturen på datan vi får från Spoonacular API:et
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
  const apiKey = process.env.SPOONACULAR_API_KEY; // Hämtar din hemliga nyckel från .env

  // URL-bygge: addRecipeNutrition=true är avgörande för att få kalorier/makros direkt
  const url = `https://api.spoonacular.com/recipes/random?number=${number}&tags=main+course&apiKey=${apiKey}&addRecipeNutrition=true`;

  try {
    // fetch med "revalidate": Säger åt Next.js att spara svaret i 1 timme (3600 sek)
    // för att spara på API-poäng och göra appen snabbare.
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) throw new Error('Misslyckades att hämta slumpmässiga recept');

    const data = await res.json();
    return data.recipes || []; // Returnerar arrayen med recept
  } catch (error) {
    console.error('Error in getRandomRecipes:', error);
    return []; // Returnerar tom array vid fel för att inte krascha frontenden
  }
}

/**
 * Hämtar en lista med recept baserat på sökning och filter
 */
export async function searchRecipes(
  query: string,
  category: string,
  sortBy: string,
) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';

  // URLSearchParams sköter formateringen av URL:en (t.ex. fixar mellanslag och &-tecken)
  const params = new URLSearchParams({
    apiKey: apiKey!,
    query: query || 'healthy', // Om sökfältet är tomt, sök på "healthy"
    addRecipeNutrition: 'true',
    number: '9', // Begränsar resultatet till 9 recept per sökning
  });

  // Lägger till filter för kategori om användaren valt något annat än "All"
  if (category !== 'All') {
    params.append('type', category.toLowerCase());
  }

  // Sorteringslogik: Spoonacular har specifika värden för 'sort'
  if (sortBy === 'Most Protein') params.append('sort', 'protein');
  else if (sortBy === 'Lowest Calories') params.append('sort', 'calories');
  else if (sortBy === 'Fastest') params.append('sort', 'readyTime');

  try {
    const res = await fetch(`${baseUrl}?${params.toString()}`);

    if (!res.ok) {
      console.error('Spoonacular API error:', res.status);
      return [];
    }

    const data = await res.json();

    // Mappar om datan (Data Cleaning):
    // Vi skickar bara vidare exakt den data frontenden behöver (id, title, image, kcal, protein, time)
    return (
      data.results?.map((r: SpoonacularRecipe) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        // Letar upp "Calories" i nutrients-arrayen och avrundar det
        kcal: Math.round(
          r.nutrition?.nutrients.find((n) => n.name === 'Calories')?.amount ||
            0,
        ),
        // Letar upp protein och lägger till "g" som en sträng
        protein:
          Math.round(
            r.nutrition?.nutrients.find((n) => n.name === 'Protein')?.amount ||
              0,
          ) + 'g',
        time: r.readyInMinutes,
      })) || []
    );
  } catch (error) {
    console.error('Fetch error in searchRecipes:', error);
    return [];
  }
}

/**
 * Hämtar all detaljerad information om ett specifikt recept via ID
 * Används när man klickar in på en enskild receptsida.
 */
export async function getRecipeDetails(id: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;

  // Loggar hjälper dig att se i terminalen (inte webbläsaren!) om något går fel
  console.log('Fetching recipe details for ID:', id);

  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      // Felhantering för specifika API-begränsningar
      // 402 = "Payment Required" (Dina gratis-poäng är slut för dagen)
      console.error(`Spoonacular API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch recipe with id: ${id}`);
    }

    const data = await res.json();
    return data; // Returnerar hela objektet med instruktioner, ingredienser etc.
  } catch (error) {
    console.error('Error in getRecipeDetails:', error);
    throw error;
  }
}
