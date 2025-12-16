// frontend/app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogMealForm from "@/app/components/LogMealForm";
import { getDailySummary } from "@/app/actions/dashboard";
import OnboardingPage from "../onboarding/page";

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
  const summary = await getDailySummary();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>

      {/* 1. THE HERO SECTION (New) */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Today&apos;s Progress</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">
              {summary?.calories_in || 0}
            </div>
            <div className="text-blue-100">Eaten</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {summary?.calories_burned || 0}
            </div>
            <div className="text-blue-100">Burned</div>
          </div>
          <div className="bg-white/20 rounded p-2">
            <div className="text-3xl font-bold">
              {summary?.calories_remaining || 0}
            </div>
            <div className="text-blue-100">Remaining</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: The New Form */}
        <div>
          <LogMealForm />
        </div>

        <div>
          <OnboardingPage />
        </div>

        {/* Column 2: Recent Workouts */}
        <div className="border rounded-lg p-6 shadow-sm bg-white h-fit">
          <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {workouts.map((workout) => (
                <li key={workout.id} className="border-b pb-2 last:border-0">
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-gray-500">
                    {workout.duration_minutes} mins • {workout.calories_burned}{" "}
                    kcal
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(workout.performed_at).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Column 3: Recent Meals */}
        <div className="border rounded-lg p-6 shadow-sm bg-white h-fit">
          <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
          {meals.length === 0 ? (
            <p className="text-gray-500">No meals logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {meals.map((meal) => (
                <li key={meal.id} className="border-b pb-2 last:border-0">
                  <div className="font-medium capitalize">{meal.name}</div>
                  <div className="text-sm text-gray-500">
                    {meal.meal_type} • {meal.calories} kcal
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(meal.eaten_at).toLocaleDateString()}
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
