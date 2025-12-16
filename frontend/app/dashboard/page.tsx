// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import { Workout, MealLog } from '@/types/database' // Uncomment if you created the types file!

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch the data concurrently
  const [workoutsData, mealsData] = await Promise.all([
    supabase
      .from("workouts")
      .select("*")
      .order("performed_at", { ascending: false }),
    supabase
      .from("meal_logs")
      .select("*")
      .order("eaten_at", { ascending: false }),
  ]);

  const workouts = workoutsData.data || [];
  const meals = mealsData.data || [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Workouts Card */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {workouts.map((workout) => (
                <li key={workout.id} className="border-b pb-2">
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-gray-500">
                    {workout.duration_minutes} mins • {workout.calories_burned}{" "}
                    kcal
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Meals Card */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
          {meals.length === 0 ? (
            <p className="text-gray-500">No meals logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {meals.map((meal) => (
                <li key={meal.id} className="border-b pb-2">
                  <div className="font-medium capitalize">{meal.name}</div>
                  <div className="text-sm text-gray-500">
                    {meal.meal_type} • {meal.calories} kcal
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
