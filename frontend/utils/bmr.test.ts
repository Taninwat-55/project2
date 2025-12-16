// frontend/utils/bmr.test.ts
import { describe, it, expect } from "vitest";
import { calculateDailyCalories, calculateAge } from "./bmr";

describe("BMR Calculation (Mifflin-St Jeor)", () => {
  // Case 1: Standard Male
  // Weight: 80kg, Height: 180cm, Age: 25, Sedentary
  // BMR = (10*80) + (6.25*180) - (5*25) + 5 = 800 + 1125 - 125 + 5 = 1805
  // Total = 1805 * 1.2 = 2166
  it("calculates correctly for a sedentary male", () => {
    const result = calculateDailyCalories(80, 180, 25, "male", "sedentary");
    expect(result).toBe(2166);
  });

  // Case 2: Standard Female
  // Weight: 60kg, Height: 165cm, Age: 30, Moderately Active
  // BMR = (10*60) + (6.25*165) - (5*30) - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
  // Total = 1320.25 * 1.55 = 2046.38... -> Rounds to 2046
  it("calculates correctly for a moderately active female", () => {
    const result = calculateDailyCalories(
      60,
      165,
      30,
      "female",
      "moderately_active"
    );
    expect(result).toBe(2046);
  });

  // Case 3: Edge Case - Very Active
  it("applies the correct multiplier for extra active users", () => {
    // Using simple numbers to verify the multiplier (1.9)
    // Male, 100kg, 200cm, 20yo => BMR = 1000 + 1250 - 100 + 5 = 2155
    // Total = 2155 * 1.9 = 4094.5 -> 4095
    const result = calculateDailyCalories(100, 200, 20, "male", "extra_active");
    expect(result).toBe(4095);
  });
});

describe("Age Calculation", () => {
  it("calculates age correctly if birthday has passed this year", () => {
    const today = new Date();
    const pastYear = today.getFullYear() - 20;
    // Set birthday to yesterday
    const dob = `${pastYear}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate() - 1).padStart(2, "0")}`;

    expect(calculateAge(dob)).toBe(20);
  });

  it("calculates age correctly if birthday has NOT passed yet", () => {
    const today = new Date();
    const pastYear = today.getFullYear() - 20;
    // Set birthday to tomorrow
    const dob = `${pastYear}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate() + 1).padStart(2, "0")}`;

    expect(calculateAge(dob)).toBe(19);
  });
});
