"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function logHydration(amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase.from("hydration_logs").insert({
        user_id: user.id,
        amount_ml: amount,
    });

    if (error) {
        console.error("Error logging hydration:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/nutrition");
    return { success: true };
}

export async function getTodayHydration() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    // Get start of today (00:00) in user's potential timezone, 
    // but for simplicity we often stick to UTC or server time in MVPs.
    // Better approach: use >= today's date at 00:00:00

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("hydration_logs")
        .select("amount_ml")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString());

    if (error || !data) return 0;

    return data.reduce((sum, record) => sum + record.amount_ml, 0);
}
