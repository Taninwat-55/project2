import Image from "next/image";
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import { updateProfile } from "@/app/actions/profile";
import { createClient } from "@/utils/supabase/client";

import { Profile } from "@/types/database";

type ProfileData = z.infer<typeof ProfileSchema>;

export default function SettingsForm({ initialData }: { initialData: Profile }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatar_url || null);
    const [uploading, setUploading] = useState(false);

    const form = useForm<ProfileData>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            firstName: initialData?.first_name || "",
            lastName: initialData?.last_name || "",
            gender: initialData?.gender || "other",
            weight: initialData?.weight_kg || 70,
            height: initialData?.height_cm || 170,
            dateOfBirth: initialData?.date_of_birth || "",
            activityLevel: initialData?.activity_level || "sedentary",
            location: initialData?.location || "",
            phone: initialData?.phone || "",
            avatarUrl: initialData?.avatar_url || "",
        },
    });

    const supabase = createClient();

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${initialData.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

            setAvatarUrl(data.publicUrl);
            form.setValue("avatarUrl", data.publicUrl);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data: ProfileData) => {
        setMessage(null);
        startTransition(async () => {
            const result = await updateProfile(data);
            if (result.success) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: result.error || "Failed to update profile" });
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
                    {avatarUrl ? (
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A7.5 7.5 0 0 1 4.501 20.118Z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    <label
                        htmlFor="avatar"
                        className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
                    >
                        {uploading ? "Uploading..." : "Change Avatar"}
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name</label>
                    <input
                        {...form.register("firstName")}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                    {form.formState.errors.firstName && (
                        <p className="text-red-500 text-sm">{form.formState.errors.firstName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name</label>
                    <input
                        {...form.register("lastName")}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                    {form.formState.errors.lastName && (
                        <p className="text-red-500 text-sm">{form.formState.errors.lastName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
                    <input
                        {...form.register("phone")}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                        placeholder="+1 234 567 890"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
                    <input
                        {...form.register("location")}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                        placeholder="City, Country"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Gender</label>
                    <select
                        {...form.register("gender")}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date of Birth</label>
                    <input
                        type="date"
                        {...form.register("dateOfBirth")}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
                    <input
                        type="number"
                        {...form.register("weight", { valueAsNumber: true })}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Height (cm)</label>
                    <input
                        type="number"
                        {...form.register("height", { valueAsNumber: true })}
                        className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Activity Level</label>
                <select
                    {...form.register("activityLevel")}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
                >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</option>
                    <option value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</option>
                    <option value="very_active">Very Active (hard exercise/sports 6-7 days/week)</option>
                    <option value="extra_active">Extra Active (very hard exercise/sports & physical job)</option>
                </select>
            </div>

            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Account Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Update Email</label>
                        <UpdateEmail />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                        <UpdatePassword />
                    </div>
                </div>
            </div>

            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        } border`}
                >
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending || uploading}
                className="w-full md:w-auto px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
                {isPending ? "Save Profile Changes" : "Save Profile Changes"}
            </button>
        </form>
    );
}

function UpdateEmail() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    async function handleUpdate() {
        if (!email) return;
        setMsg("Updating...");
        const { updateEmail } = await import("@/app/actions/profile");
        const res = await updateEmail(email);
        if (res.success) setMsg("Check email for confirmation.");
        else setMsg(res.error as string);
    }

    return (
        <div className="space-y-2">
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="New Email"
                className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
            />
            <div className="flex justify-between items-center">
                <button type="button" onClick={handleUpdate} className="text-sm text-blue-600 hover:underline">Update Email</button>
                {msg && <span className="text-xs text-zinc-500">{msg}</span>}
            </div>
        </div>
    )
}

function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function handleUpdate() {
        if (!password) return;
        setMsg("Updating...");
        const { updatePassword } = await import("@/app/actions/profile");
        const res = await updatePassword(password);
        if (res.success) setMsg("Password updated.");
        else setMsg(res.error as string);
    }

    return (
        <div className="space-y-2">
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="New Password"
                className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent"
            />
            <div className="flex justify-between items-center">
                <button type="button" onClick={handleUpdate} className="text-sm text-blue-600 hover:underline">Update Password</button>
                {msg && <span className="text-xs text-zinc-500">{msg}</span>}
            </div>
        </div>
    )
}
