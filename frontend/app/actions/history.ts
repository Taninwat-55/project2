"use server";

import { createClient } from "@/utils/supabase/server";

export type HistoryItem = {
    id: number;
    type: 'workout' | 'meal';
    name: string;
    date: string; // Formatting for UI, e.g., "Today, 14:20"
    timestamp: Date; // For sorting
    detail: string;
    color: string;
    bg: string;
    moreInfo: any;
};

export async function getUserHistory() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    // Fetch Meals
    const { data: meals, error: mealsError } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("eaten_at", { ascending: false })
        .limit(20);

    if (mealsError) {
        console.error("Error fetching meals:", mealsError);
    }

    // Fetch Workouts
    const { data: workouts, error: workoutsError } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("performed_at", { ascending: false })
        .limit(20);

    if (workoutsError) {
        console.error("Error fetching workouts:", workoutsError);
    }

    const historyItems: HistoryItem[] = [];

    // Process Meals
    if (meals) {
        meals.forEach((meal) => {
            const date = new Date(meal.eaten_at);
            historyItems.push({
                id: meal.id,
                type: 'meal',
                name: meal.name,
                date: formatDate(date),
                timestamp: date,
                detail: `${meal.meal_type} • ${meal.calories} kcal`,
                color: 'text-green-500',
                bg: 'bg-green-500/10',
                moreInfo: {
                    macros: {
                        p: `${meal.protein_g}g`,
                        c: `${meal.carbs_g || 0}g`,
                        f: `${meal.fat_g || 0}g`
                    },
                }
            });
        });
    }

    // Process Workouts
    if (workouts) {
        workouts.forEach((workout) => {
            const date = new Date(workout.performed_at);
            historyItems.push({
                id: workout.id, // ID collision possible if types are not separated, but safe for key if combined with type
                type: 'workout',
                name: workout.name,
                date: formatDate(date),
                timestamp: date,
                detail: `${workout.duration_minutes} min • ${workout.calories_burned} kcal`,
                color: 'text-orange-500',
                bg: 'bg-orange-500/10',
                moreInfo: {
                    // Exercises are not in the top-level workout query usually, depends on schema. 
                    // Assuming basic info for now or empty if joining logic is complex.
                    // If the schema supports JSON or joined tables, we'd add it here.
                    exercises: [],
                    intensity: 'High', // Placeholder or calculation
                }
            });
        });
    }

    // Sort combined list by timestamp descending
    return historyItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function formatDate(date: Date): string {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (isToday) {
        return `Today, ${timeString}`;
    } else if (isYesterday) {
        return `Yesterday, ${timeString}`;
    } else {
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeString}`;
    }
}
