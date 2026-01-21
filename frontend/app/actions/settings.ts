"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Types for user settings
export interface UserSettings {
    // Fitness Preferences
    distance_unit: "kilometers" | "miles";
    weight_unit: "kilograms" | "pounds";
    energy_unit: "calories" | "kilojoules";
    primary_focus: string;
    weekly_goal: number;
    weekly_weight_goal_kg: number;
    strength_goal_days: number;
    cardio_goal_minutes: number;
    activity_level: string;

    // Notifications
    pause_all_notifications: boolean;
    daily_reminders: boolean;
    goal_completions: boolean;
    weekly_report: boolean;
    friend_requests: boolean;
    challenge_invites: boolean;
    comments_mentions: boolean;
    kudos: boolean;

    // Privacy
    public_profile: boolean;
    share_activity: boolean;
    allow_friend_requests: boolean;
    anonymous_analytics: boolean;

    // Display
    font_size: number;
    reduce_motion: boolean;
    high_contrast: boolean;
}

// Default settings
const defaultSettings: UserSettings = {
    distance_unit: "kilometers",
    weight_unit: "kilograms",
    energy_unit: "calories",
    primary_focus: "general_fitness",
    weekly_goal: 4,
    weekly_weight_goal_kg: 0,
    strength_goal_days: 3,
    cardio_goal_minutes: 120,
    activity_level: "lightly_active",
    pause_all_notifications: false,
    daily_reminders: false,
    goal_completions: false,
    weekly_report: false,
    friend_requests: true,
    challenge_invites: true,
    comments_mentions: true,
    kudos: true,
    public_profile: false,
    share_activity: false,
    allow_friend_requests: true,
    anonymous_analytics: true,
    font_size: 16,
    reduce_motion: false,
    high_contrast: false,
};

// Get user settings
export async function getUserSettings(): Promise<UserSettings> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return defaultSettings;

    const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error || !data) {
        // If no settings exist, create them
        const { data: newSettings } = await supabase
            .from("user_settings")
            .insert({ user_id: user.id })
            .select()
            .single();

        return newSettings || defaultSettings;
    }

    return data as UserSettings;
}

// Update user settings (partial update)
export async function updateUserSettings(
    settings: Partial<UserSettings>
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
        .from("user_settings")
        .update({
            ...settings,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating settings:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/settings");
    return { success: true };
}

// Update fitness preferences specifically
// Update fitness preferences specifically
export async function updateFitnessPreferences(data: {
    distance_unit: string;
    weight_unit: string;
    energy_unit: string;
    primary_focus: string;
    weekly_goal: number;
    weekly_weight_goal_kg: number;
    strength_goal_days: number;
    cardio_goal_minutes: number;
    activity_level: string;
}): Promise<{ success: boolean; error?: string }> {
    return updateUserSettings({
        distance_unit: data.distance_unit as "kilometers" | "miles",
        weight_unit: data.weight_unit as "kilograms" | "pounds",
        energy_unit: data.energy_unit as "calories" | "kilojoules",
        primary_focus: data.primary_focus,
        weekly_goal: data.weekly_goal,
        weekly_weight_goal_kg: data.weekly_weight_goal_kg,
        strength_goal_days: data.strength_goal_days,
        cardio_goal_minutes: data.cardio_goal_minutes,
        activity_level: data.activity_level,
    });
}

// Update notification settings
export async function updateNotificationSettings(data: {
    pause_all_notifications: boolean;
    daily_reminders: boolean;
    goal_completions: boolean;
    weekly_report: boolean;
    friend_requests: boolean;
    challenge_invites: boolean;
    comments_mentions: boolean;
    kudos: boolean;
}): Promise<{ success: boolean; error?: string }> {
    return updateUserSettings(data);
}

// Update privacy settings
export async function updatePrivacySettings(data: {
    public_profile: boolean;
    share_activity: boolean;
    allow_friend_requests: boolean;
    anonymous_analytics: boolean;
}): Promise<{ success: boolean; error?: string }> {
    return updateUserSettings(data);
}

// Update display settings
export async function updateDisplaySettings(data: {
    font_size: number;
    reduce_motion: boolean;
    high_contrast: boolean;
}): Promise<{ success: boolean; error?: string }> {
    return updateUserSettings(data);
}
