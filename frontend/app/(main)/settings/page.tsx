"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
    User as UserIcon,
    Dumbbell,
    Bell,
    Shield,
    Monitor,
    HelpCircle,
    LogOut,
    MapPin,
    CalendarDays,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { updateProfile, updateEmail, updatePassword } from "@/app/actions/profile";
import { ActivityLevel, Gender } from "@/types/database";

const sidebarTabs = [
    { id: "account", label: "Account", icon: UserIcon, href: "/settings" },
    { id: "fitness", label: "Fitness Preferences", icon: Dumbbell, href: "/settings/fitness-preferences" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: Shield, href: "/settings/privacy" },
    { id: "display", label: "Display", icon: Monitor, href: "/settings/display" },
];

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error", text: string } | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        height: 170,
        weight: 70,
        gender: "other",
        dateOfBirth: "",
        activityLevel: "sedentary",
        avatarUrl: "",
        language: "English (US)",
        timezone: "(GMT-8:00) Pacific Time (USA & Canada)",
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setFormData((prev) => ({
                    ...prev,
                    firstName: profile.first_name || "",
                    lastName: profile.last_name || "",
                    email: user.email || "",
                    phone: profile.phone || "",
                    location: profile.location || "",
                    avatarUrl: profile.avatar_url || "",
                    height: profile.height_cm || 170,
                    weight: profile.weight_kg || 70,
                    gender: profile.gender || "other",
                    dateOfBirth: profile.date_of_birth || "",
                    activityLevel: profile.activity_level || "sedentary",
                }));
            }
            setLoading(false);
        };
        load();
    }, [router, supabase]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user) return;
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, avatarUrl: data.publicUrl }));

            // Auto save avatar update
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                height: formData.height,
                weight: formData.weight,
                gender: formData.gender as Gender,
                dateOfBirth: formData.dateOfBirth,
                activityLevel: formData.activityLevel as ActivityLevel,
                location: formData.location,
                phone: formData.phone,
                avatarUrl: data.publicUrl
            });

        } catch {
            setMsg({ type: "error", text: "Error uploading image" });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMsg(null);
        try {
            // 1. Update Profile
            const res = await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                height: formData.height,
                weight: formData.weight,
                gender: formData.gender as Gender,
                dateOfBirth: formData.dateOfBirth,
                activityLevel: formData.activityLevel as ActivityLevel,
                location: formData.location,
                phone: formData.phone,
                avatarUrl: formData.avatarUrl
            });

            if (!res.success) throw new Error(res.error as string);

            // 2. Update Email if changed
            if (user?.email !== formData.email) {
                const emailRes = await updateEmail(formData.email);
                if (!emailRes.success) throw new Error(emailRes.error as string);
                setMsg({ type: "success", text: "Profile updated. Please check email to confirm change." });
            }

            // 3. Update Password if provided
            if (formData.password) {
                const passRes = await updatePassword(formData.password);
                if (!passRes.success) throw new Error(passRes.error as string);
            }

            if (!msg) setMsg({ type: "success", text: "Changes saved successfully." });

        } catch (error) {
            setMsg({ type: "error", text: (error as Error).message });
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-[var(--muted-foreground)]">Loading...</div>
            </div>
        );
    }

    const displayName = formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : (user?.email?.split("@")[0] || "User");

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        {/* User Card */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden relative">
                                    {formData.avatarUrl ? (
                                        <Image src={formData.avatarUrl} alt="User" fill className="object-cover" />
                                    ) : (
                                        displayName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-sm truncate w-32">{displayName}</div>
                                    <div className="text-xs text-[var(--muted-foreground)]">Pro Member</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1 mb-6">
                            {sidebarTabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.id === "account"
                                        ? "bg-[var(--color-accent)] text-white"
                                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="border-t border-[var(--border)] pt-4 space-y-1">
                            <Link
                                href="/support"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                            >
                                <HelpCircle size={18} />
                                Help & Support
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--muted)] transition-colors"
                            >
                                <LogOut size={18} />
                                Sign out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Account Setting</h1>
                            <p className="text-[var(--muted-foreground)] text-sm">Manage your personal details and subscriptions</p>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden border-2 border-transparent group-hover:border-[var(--color-accent)] transition-all relative">
                                        {formData.avatarUrl ? (
                                            <Image src={formData.avatarUrl} alt="Profile" fill className="object-cover" />
                                        ) : (
                                            displayName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white text-xs shadow-md z-10">
                                        📷
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold">{displayName}</h2>
                                    <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mt-1">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays size={14} />
                                            Member since {new Date(user?.created_at || "").getFullYear()}
                                        </span>
                                        {formData.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {formData.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="px-3 py-1.5 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-full text-xs font-medium">
                                    Pro Plan Active
                                </span>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Personal Information</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Leave blank to keep current"
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="City, Country"
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Regional Settings */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-bold mb-6">Regional Setting</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option>English (US)</option>
                                        <option>English (UK)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-[var(--muted-foreground)]">Time Zone</label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option>(GMT-8:00) Pacific Time (USA & Canada)</option>
                                        <option>(GMT-5:00) Eastern Time (USA & Canada)</option>
                                        <option>(GMT+0:00) UTC</option>
                                        <option>(GMT+1:00) Central European Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {msg && (
                            <div className={`p-4 mb-6 rounded-lg border ${msg.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                                {msg.text}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mb-8">
                            <button
                                onClick={() => router.refresh()}
                                className="px-6 py-3 border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="bg-[#0c0c0e] border border-red-900/50 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-red-500 mb-1">Delete Account</h3>
                                    <p className="text-sm text-[var(--muted-foreground)]">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button className="px-5 py-2.5 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-500/10 transition-colors">
                                    Delete your account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
