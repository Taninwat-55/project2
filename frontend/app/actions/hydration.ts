'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Loggar en specifik mängd vatten (i ml) för den inloggade användaren.
 */
export async function logHydration(amount: number) {
  const supabase = await createClient();
  // Hämtar användarsessionen från servern
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Säkerhetskontroll: Endast inloggade användare kan spara data
  if (!user) return { success: false, error: 'Ej behörig' };

  // Infogar en ny rad i tabellen 'hydration_logs'
  const { error } = await supabase.from('hydration_logs').insert({
    user_id: user.id,
    amount_ml: amount,
  });

  if (error) {
    console.error('Fel vid loggning av vattenintag:', error);
    return { success: false, error: error.message };
  }

  // Uppdaterar nutrition-sidan så att den totala vattenmängden uppdateras direkt i UI
  revalidatePath('/nutrition');
  return { success: true };
}

/**
 * Hämtar och summerar allt vattenintag som loggats under den nuvarande dagen.
 */
export async function getTodayHydration() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Om ingen användare hittas returneras noll
  if (!user) return 0;

  // 1. Skapa en tidsstämpel för början av dagen (kl. 00:00:00)
  // Detta används för att filtrera bort loggar från tidigare dagar
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Hämta alla rader för användaren som skapats från och med idag
  const { data, error } = await supabase
    .from('hydration_logs')
    .select('amount_ml')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString());

  if (error || !data) return 0;

  // 3. Summera alla 'amount_ml' från resultatet till ett totalvärde
  return data.reduce((sum, record) => sum + record.amount_ml, 0);
}
