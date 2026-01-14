"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { ActivityLevel, Gender } from "@/types/database";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ToastContext";

export default function OnboardingForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await updateProfile({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      gender: formData.get("gender") as Gender,
      weight: parseFloat(formData.get("weight") as string),
      height: parseFloat(formData.get("height") as string),
      dateOfBirth: formData.get("dateOfBirth") as string,
      activityLevel: formData.get("activityLevel") as ActivityLevel,
    });

    if (result.success) {
      showToast("Profile saved successfully!", "success");
      router.push("/dashboard"); // Go to dashboard after setup
    } else {
      showToast(result.error || "Failed to save profile", "error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-black p-8 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Setup your Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            required
            className="border p-2 rounded"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            required
            className="border p-2 rounded"
          />
        </div>

        <select
          name="gender"
          className="border p-2 rounded bg-transparent"
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="weight"
            type="number"
            step="0.1"
            placeholder="Weight (kg)"
            required
            className="border p-2 rounded"
          />
          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            required
            className="border p-2 rounded"
          />
        </div>

        <select
          name="activityLevel"
          className="border p-2 rounded bg-transparent"
          required
        >
          <option value="sedentary">Sedentary (Office job)</option>
          <option value="lightly_active">Lightly Active (1-3 days/week)</option>
          <option value="moderately_active">
            Moderately Active (3-5 days/week)
          </option>
          <option value="very_active">Very Active (6-7 days/week)</option>
          <option value="extra_active">Extra Active (Physical job)</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
        >
          {loading ? "Calculating Goal..." : "Save & Calculate Goal"}
        </button>
      </form>
    </div>
  );
}
