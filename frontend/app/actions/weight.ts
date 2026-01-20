"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type WeightLog = {
    id: string;
    weight_kg: number;
    logged_at: string;
};

export async function logWeight(weight: number, date: Date) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase.from("weight_logs").insert({
        user_id: user.id,
        weight_kg: weight,
        logged_at: date.toISOString(),
    });

    if (error) {
        console.error("Error logging weight:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function getWeightHistory(limit = 10) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching weight history:", error);
        return [];
    }

    return data as WeightLog[];
}
