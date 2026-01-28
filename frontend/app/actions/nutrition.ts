'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * --- INTERFACES & SCHEMAN ---
 * Vi definierar hur datan ska se ut för att TypeScript och Zod ska kunna
 * varna oss om vi skickar felaktig info till databasen.
 */

interface MealTemplateData {
  name: string;
  total_kcal?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
}

interface UpdateMealData {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

// Zod-schema för strikt validering av måltidsdata innan den når databasen
const MealSchema = z.object({
  name: z.string().min(1, 'Namn krävs'),
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
});

/**
 * --- MEAL LOG ACTIONS (Logga, hämta, radera, uppdatera) ---
 */

// Logga en ny måltid (används av recept-sidan och manuell loggning)
export async function logMeal(data: z.infer<typeof MealSchema>) {
  // Validera att inkommande data stämmer överens med schemat (kastar fel om validering misslyckas)
  const validatedData = MealSchema.parse(data);

  const supabase = await createClient();
  // Hämtar den aktuella användaren från Supabase Auth-sessionen
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Du måste vara inloggad' };

  // Vi mappar frontend-namnen (protein) till databasens kolumner (protein_g)
  const { error } = await supabase.from('meal_logs').insert({
    user_id: user.id, // Kopplar måltiden till den inloggade användaren
    name: validatedData.name,
    meal_type: validatedData.type,
    calories: Math.round(validatedData.calories),
    protein_g: Math.round(validatedData.protein),
    carbs_g: Math.round(validatedData.carbs),
    fat_g: Math.round(validatedData.fat),
    eaten_at: new Date().toISOString(), // Sparar tidpunkten för loggningen
  });

  if (error) return { success: false, error: error.message };

  // Uppdatera nutrition-sidan så att graferna visar den nya maten direkt (on-demand revalidation)
  revalidatePath('/nutrition');
  return { success: true };
}

// Hämta alla måltider som loggats idag
export async function getTodayMeals() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Skapa en tidsstämpel för början av dagen (00:00:00) för att filtrera dagens intag
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user.id) // Hämtar endast den inloggade användarens data
    .gte('eaten_at', today.toISOString()) // "Greater than or equal to" början av dagen
    .order('eaten_at', { ascending: false }); // Nyaste måltiderna först

  if (error) {
    console.error('Fel vid hämtning av måltider:', error.message);
    return [];
  }

  return data || [];
}

// Radera en specifik loggad måltid
export async function deleteMealLog(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('meal_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Extra säkerhet: Radera bara om det är användarens egen rad

  if (error) return { success: false, error: error.message };

  // Uppdaterar cachen på nutrition-sidan så att raden försvinner direkt i UI
  revalidatePath('/nutrition');
  return { success: true };
}

// Uppdatera en befintlig måltid (t.ex. ändra mängd eller namn i efterhand)
export async function updateMealLog(id: string, updates: UpdateMealData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('meal_logs')
    .update({
      name: updates.name,
      calories: Math.round(updates.calories),
      protein_g: Math.round(updates.protein_g),
      carbs_g: Math.round(updates.carbs_g),
      fat_g: Math.round(updates.fat_g),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/nutrition');
  return { success: true };
}

/**
 * --- TEMPLATE ACTIONS (Spara och använd mallar) ---
 */

// Spara en måltid som en mall (favorit) för framtida bruk
export async function saveMealTemplate(data: {
  name: string;
  ingredients: {
    name: string;
    kcal: number;
    p: number;
    c: number;
    f: number;
  }[];
  totals: { kcal: number; p: number; c: number; f: number };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase.from('meal_templates').insert({
    user_id: user.id,
    name: data.name,
    // Just nu sparas totalerna i specifika kolumner för enkel summering
    total_kcal: data.totals.kcal,
    total_protein: data.totals.p,
    total_carbs: data.totals.c,
    total_fat: data.totals.f,
    // Notera: Ingredienser skickas in men sparas inte i denna version av anropet
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/nutrition');
  return { success: true };
}

// Hämta alla sparade mallar för den inloggade användaren
export async function getMealTemplates() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('meal_templates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

// Logga en måltid direkt från en sparad mall (kopierar värden från mall till logg)
export async function logMealFromTemplate(
  template: MealTemplateData,
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase.from('meal_logs').insert({
    user_id: user.id,
    name: template.name,
    meal_type: type,
    calories: template.total_kcal,
    protein_g: template.total_protein,
    carbs_g: template.total_carbs,
    fat_g: template.total_fat,
    eaten_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/nutrition');
  return { success: true };
}

// Extern API-koppling för att hämta slumpmässiga receptförslag
export async function getRandomRecipes(number = 3) {
  const API_KEY = process.env.SPOONACULAR_API_KEY;

  try {
    // Vi lägger till tags=main course för att få riktiga måltider
    // och använder Next.js fetch-cache för att spara på API-kvoten
    const res = await fetch(
      `https://api.spoonacular.com/recipes/random?number=${number}&tags=main+course&apiKey=${API_KEY}`,
      { next: { revalidate: 3600 } }, // Resultatet sparas i cachen i 1 timme
    );

    if (!res.ok) throw new Error('Misslyckades att hämta recept');

    const data = await res.json();
    return data.recipes;
  } catch (error) {
    console.error('Spoonacular Error:', error);
    return [];
  }
}
