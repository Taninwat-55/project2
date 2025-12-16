"use client";

import { useState } from "react";
import { seedData } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (
      !confirm(
        "⚠️ This will delete all your current meals and workouts. Are you sure?"
      )
    )
      return;

    setLoading(true);
    const result = await seedData();
    setLoading(false);

    if (result.success) {
      alert("✅ Data has been reset to Demo Mode!");
      router.push("/dashboard"); // Redirect to show the fresh data
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Admin Zone</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Use this tool to reset your account with dummy data for testing
          purposes.
        </p>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "🔴 RESET ACCOUNT DATA"}
        </button>
      </div>
    </div>
  );
}
