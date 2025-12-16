"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MealType } from "@/types/database"; 

export default function LogMealForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [type, setType] = useState<MealType>("breakfast");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      return;
    }

    // 2. Insert data into Supabase
    const { error } = await supabase.from("meal_logs").insert({
      user_id: user.id,
      name,
      meal_type: type,
      calories: parseInt(calories),
      protein_g: protein ? parseFloat(protein) : null,
      eaten_at: new Date().toISOString(), // Today's date
    });

    if (error) {
      alert(error.message);
    } else {
      // 3. Clear form and refresh the page to show new data
      setName("");
      setCalories("");
      setProtein("");
      router.refresh(); // <--- The Magic: Reloads the Server Component (Dashboard) to show the new meal!
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Add a Meal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Food Name
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Banana"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calories
            </label>
            <input
              required
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 105"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Protein (g)
            </label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="Optional"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm text-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MealType)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black bg-white"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Adding..." : "Log Meal"}
        </button>
      </form>
    </div>
  );
}
