"use server";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

if (!SPOONACULAR_API_KEY) {
    console.warn("Missing SPOONACULAR_API_KEY environment variable. Recipe features will not work.");
}

export type RecipeSearchResult = {
    id: number;
    title: string;
    image: string;
    imageType: string;
};

export type RecipeSearchResponse = {
    results: RecipeSearchResult[];
    offset: number;
    number: number;
    totalResults: number;
};

/**
 * Searches for recipes using the Spoonacular API.
 * @param query The search query (e.g., "pasta", "chicken")
 * @param offset The number of results to skip (for pagination)
 * @param number The number of results to return (default 10)
 */
export async function searchRecipes(query: string, offset: number = 0, number: number = 10) {
    if (!SPOONACULAR_API_KEY) {
        return { success: false, error: "API key is missing" };
    }

    try {
        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
            query,
            offset: offset.toString(),
            number: number.toString(),
        });

        const response = await fetch(`${BASE_URL}/complexSearch?${params}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("SPOONACULAR API ERROR:", response.status, errorData);
            return { success: false, error: `Spoonacular API Error: ${response.statusText}` };
        }

        const data: RecipeSearchResponse = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        return { success: false, error: "Failed to connect to recipe service" };
    }
}

/**
 * Gets detailed information about a specific recipe.
 * @param id The Spoonacular recipe ID
 */
export async function getRecipeInformation(id: number) {
    if (!SPOONACULAR_API_KEY) {
        return { success: false, error: "API key is missing" };
    }

    try {
        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
        });

        const response = await fetch(`${BASE_URL}/${id}/information?${params}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("SPOONACULAR API ERROR DETAILS:", response.status, errorData);
            return { success: false, error: `Spoonacular API Error: ${response.statusText}` };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch recipe details:", error);
        return { success: false, error: "Failed to connect to recipe service" };
    }
}
