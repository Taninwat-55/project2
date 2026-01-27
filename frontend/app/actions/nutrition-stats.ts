'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Beräknar ett justerat kalorimål baserat på användarens basmål
 * och hur mycket de har förbränt genom träning under dagen.
 */
export async function getAdjustedDailyGoal(baseGoal: number = 1500) {
  const supabase = await createClient();
  // Hämtar den inloggade användaren
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Om ingen användare är inloggad returneras bara standardmålet
  if (!user) return baseGoal;

  // 1. Definiera tidsintervallet för "idag" (från midnatt till midnatt)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 2. Hämta alla kalorier som bränts idag från tabellen 'workouts'
  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('calories_burned')
    .eq('user_id', user.id)
    .gte('performed_at', today.toISOString()) // Från och med idag kl 00:00
    .lt('performed_at', tomorrow.toISOString()); // Innan imorgon kl 00:00

  if (error) {
    console.error("Error fetching today's burned calories:", error);
    return baseGoal;
  }

  // 3. Summera alla brända kalorier från dagens träningspass
  const burnedToday =
    workouts?.reduce((acc, w) => acc + (w.calories_burned || 0), 0) || 0;

  // 4. Returnera ett objekt med detaljerad information om det justerade målet
  // Logik: Basmål + Brända kalorier = Nytt mål för dagen
  return {
    baseGoal, // Det ursprungliga målet (t.ex. 2000 kcal)
    burnedToday, // Extra kalorier intjänade via aktivitet
    adjustedGoal: baseGoal + burnedToday, // Det totala utrymmet användaren har att äta
  };
}
