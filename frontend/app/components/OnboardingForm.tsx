"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { ActivityLevel, Gender } from "@/types/database";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ToastContext";
import { User, Ruler, Weight, Calendar, Activity } from "lucide-react";

export default function OnboardingForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const profileData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      gender: formData.get("gender") as Gender,
      weight: parseFloat(formData.get("weight") as string),
      height: parseFloat(formData.get("height") as string),
      dateOfBirth: formData.get("dateOfBirth") as string,
      activityLevel: formData.get("activityLevel") as ActivityLevel,
    };

    if (process.env.NODE_ENV !== "production") {
      console.log("[OnboardingForm] Submitting profile data:", profileData);
    }

    const result = await updateProfile(profileData);

    if (process.env.NODE_ENV !== "production") {
      console.log("[OnboardingForm] updateProfile result:", result);
    }

    if (result.success) {
      showToast("Profile saved successfully!", "success");
      router.push("/dashboard");
    } else {
      showToast(result.error || "Failed to save profile", "error");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Overlay - matching login page style */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-slate-900)_0%,_#000000_100%)] opacity-80 z-10"></div>
        {/* Optional: Add the same gym image background if desired, or keep it clean */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      <main className="relative z-20 flex-1 flex items-center justify-center px-4 w-full py-10">
        <div className="w-full max-w-[600px] p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl">
          <div className="w-full h-full bg-black/40 rounded-[31px] p-8 md:p-10 border border-white/5 shadow-2xl backdrop-blur-md">

            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg mx-auto mb-4">
                N
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Setup your Profile</h1>
              <p className="text-gray-400 text-sm">Let&apos;s personalize your Nexus experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 ml-1">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[var(--color-accent)] transition-colors" />
                    <input
                      name="firstName"
                      placeholder="First Name"
                      required
                      className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-10 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 ml-1">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[var(--color-accent)] transition-colors" />
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      required
                      className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-10 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 ml-1">Gender</label>
                <div className="relative group">
                  <select
                    name="gender"
                    defaultValue=""
                    className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 px-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {/* Custom arrow could be added here but defaulting for now */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 ml-1">Weight (kg)</label>
                  <div className="relative group">
                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[var(--color-accent)] transition-colors" />
                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      required
                      className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-10 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 ml-1">Height (cm)</label>
                  <div className="relative group">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[var(--color-accent)] transition-colors" />
                    <input
                      name="height"
                      type="number"
                      placeholder="0"
                      required
                      className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-10 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 ml-1">Date of Birth</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[var(--color-accent)] transition-colors" />
                  <input
                    name="dateOfBirth"
                    type="date"
                    required
                    className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-10 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 ml-1">Activity Level</label>
                <div className="relative group">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-[var(--color-accent)] transition-colors" />
                  <select
                    name="activityLevel"
                    defaultValue=""
                    className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-10 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Activity Level</option>
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                    <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                    <option value="very_active">Very Active (6-7 days/week)</option>
                    <option value="extra_active">Extra Active (Physical job)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-accent)] text-white font-bold py-3.5 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
