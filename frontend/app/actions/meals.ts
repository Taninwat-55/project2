'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { MealSchema } from '@/lib/schemas';
import { z } from 'zod';

// Vi kan härleda TypeScript-typen direkt från vårt Zod-schema!
type MealData = z.infer<typeof MealSchema>;

/**
 * Loggar en måltid till databasen.
 * Denna funktion körs endast på servern och hanterar validering,
 * autentisering och databasanrop.
 */
export async function logMeal(data: MealData) {
  // 1. Validera inkommande data med Zod för att säkerställa att den följer schemat
  const validation = MealSchema.safeParse(data);

  if (!validation.success) {
    // Returnera det första felmeddelandet till användargränssnittet om valideringen misslyckas
    // ÄNDRING: Använd .issues istället för .errors för att komma åt felen
    return { success: false, error: validation.error.issues[0].message };
  }

  // Initiera Supabase-klienten för serverbruk
  const supabase = await createClient();

  // Kontrollera att användaren är autentiserad
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Om ingen användare hittas, neka åtkomst
  if (!user) return { success: false, error: 'Ej behörig' };

  // 2. Skicka datan till Supabase-tabellen 'meal_logs'
  const { error } = await supabase.from('meal_logs').insert({
    user_id: user.id, // Koppla måltiden till den inloggade användarens unika ID
    name: data.name,
    meal_type: data.type,
    calories: data.calories,
    protein_g: data.protein || 0, // Fallback till 0 om proteinvärde saknas
    eaten_at: new Date().toISOString(), // Spara tidpunkten för loggningen i ISO-format
  });

  // Hantera eventuella databasfel
  if (error) return { success: false, error: error.message };

  // 3. Uppdatera cachen för dashboarden så att den nya måltiden syns direkt utan manuell omladdning
  revalidatePath('/dashboard');

  return { success: true };
}
