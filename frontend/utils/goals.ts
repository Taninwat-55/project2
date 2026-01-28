// Macro calculation utilities based on calorie goal and body weight

export interface MacroGoals {
    calorieGoal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
}

// Default goals for users without complete profile
export const DEFAULT_GOALS: MacroGoals = {
    calorieGoal: 2000,
    proteinG: 150,
    carbsG: 200,
    fatG: 55,
};

/**
 * Calculate macro goals based on calorie goal and body weight
 * 
 * Standard ratios used:
 * - Protein: ~2g per kg bodyweight (for active individuals)
 * - Fat: 25% of total calories
 * - Carbs: Remaining calories after protein and fat
 */
export function calculateMacroGoals(
    calorieGoal: number,
    weightKg: number | null
): MacroGoals {
    // Use default weight if not provided (70kg is average)
    const weight = weightKg ?? 70;

    // Protein: 2g per kg of body weight
    const proteinG = Math.round(weight * 2);

    // Fat: 25% of total calories (9 cal per gram)
    const fatG = Math.round((calorieGoal * 0.25) / 9);

    // Carbs: Remaining calories (4 cal per gram for both protein and carbs)
    const proteinCalories = proteinG * 4;
    const fatCalories = fatG * 9;
    const remainingCalories = calorieGoal - proteinCalories - fatCalories;
    const carbsG = Math.round(Math.max(0, remainingCalories) / 4);

    return {
        calorieGoal,
        proteinG,
        carbsG,
        fatG,
    };
}
