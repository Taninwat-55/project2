"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type GoalType = "short_term" | "medium_term" | "long_term";
export type GoalStatus = "active" | "completed" | "abandoned";

export interface UserGoal {
    id: string;
    user_id: string;
    goal_type: GoalType;
    title: string;
    description?: string;
    target_date?: string;
    status: GoalStatus;
    created_at: string;
    updated_at: string;
}

export interface CreateGoalData {
    goal_type: GoalType;
    title: string;
    description?: string;
    target_date?: string;
}

export interface UpdateGoalData {
    title?: string;
    description?: string;
    target_date?: string;
    status?: GoalStatus;
}

export async function getUserGoals(): Promise<UserGoal[]> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching goals:", error);
        return [];
    }

    return data || [];
}

export async function getActiveGoals(): Promise<UserGoal[]> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching active goals:", error);
        return [];
    }

    return data || [];
}

export async function createGoal(
    goalData: CreateGoalData
): Promise<{ success: boolean; error?: string; goal?: UserGoal }> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("user_goals")
        .insert({
            user_id: user.id,
            goal_type: goalData.goal_type,
            title: goalData.title,
            description: goalData.description || null,
            target_date: goalData.target_date || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating goal:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true, goal: data };
}

export async function updateGoal(
    goalId: string,
    updateData: UpdateGoalData
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("user_goals")
        .update({
            ...updateData,
            updated_at: new Date().toISOString(),
        })
        .eq("id", goalId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating goal:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteGoal(
    goalId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", goalId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting goal:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function completeGoal(
    goalId: string
): Promise<{ success: boolean; error?: string }> {
    return updateGoal(goalId, { status: "completed" });
}
