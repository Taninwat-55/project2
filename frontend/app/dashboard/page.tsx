// frontend/app/dashboard/page.tsx
import { getDailySummary } from "@/app/actions/dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogMealForm from "@/app/components/LogMealForm";
import Link from "next/link"; // <--- Add this import

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch ALL data (Summary + Lists + PROFILE)
  const summary = await getDailySummary();

  // Fetch the profile data specifically to display weight/height
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
    <div className="p-8 max-w-6xl mx-auto">
      {/* 1. HERO SECTION (Summary) */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Today&apos;s Progress</h2>
          <p className="opacity-90">
            Goal: {profile?.daily_calorie_goal || 2000} kcal
          </p>
        </div>

        <div className="flex gap-6 text-center mt-4 md:mt-0">
          <div>
            <div className="text-3xl font-bold">
              {summary?.calories_in || 0}
            </div>
            <div className="text-blue-100 text-sm">Eaten</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {summary?.calories_burned || 0}
            </div>
            <div className="text-blue-100 text-sm">Burned</div>
          </div>
          <div className="bg-white/20 rounded p-2 px-4">
            <div className="text-3xl font-bold">
              {summary?.calories_remaining || 0}
            </div>
            <div className="text-blue-100 text-sm">Remaining</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Profile & Actions */}
        <div className="space-y-6">
          {/* NEW: Profile Card */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">My Profile</h3>
              <Link
                href="/onboarding"
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium">{profile?.weight_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Height</span>
                <span className="font-medium">{profile?.height_cm} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Activity</span>
                <span className="font-medium capitalize">
                  {profile?.activity_level?.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <LogMealForm />
        </div>

        {/* Column 2: Recent Workouts */}
        <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-900 h-fit dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {workouts.map((workout) => (
                <li
                  key={workout.id}
                  className="border-b pb-2 last:border-0 dark:border-gray-700"
                >
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
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
        <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-900 h-fit dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
          {meals.length === 0 ? (
            <p className="text-gray-500">No meals logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {meals.map((meal) => (
                <li
                  key={meal.id}
                  className="border-b pb-2 last:border-0 dark:border-gray-700"
                >
                  <div className="font-medium capitalize">{meal.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
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
