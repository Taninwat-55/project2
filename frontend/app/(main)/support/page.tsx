"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    Rocket,
    Smartphone,
    ClipboardList,
    Apple,
    CreditCard,
    Settings,
    ChevronDown,
    Mail,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

const sidebarTabs = [
    { id: "account", label: "Account", icon: UserIcon, href: "/settings" },
    { id: "fitness", label: "Fitness Preferences", icon: Dumbbell, href: "/settings/fitness-preferences" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/settings/notifications" },
    { id: "privacy", label: "Privacy", icon: Shield, href: "/settings/privacy" },
    { id: "display", label: "Display", icon: Monitor, href: "/settings/display" },
];

const categories = [
    { id: "getting-started", label: "Getting started", description: "Set up your account and profile basics.", icon: Rocket },
    { id: "device-syncing", label: "Device Syncing", description: "Pair your watch or tracker easily.", icon: Smartphone },
    { id: "workout-plans", label: "Workout and Plans", description: "Logging exercises and creating routines.", icon: ClipboardList },
    { id: "nutrition", label: "Nutrition", description: "Tracking macros, calories and meals.", icon: Apple },
    { id: "billing", label: "Billing and Subscription", description: "Manage your premium membership.", icon: CreditCard },
    { id: "account-settings", label: "Account Setting", description: "Privacy, data and preferences.", icon: Settings },
];

const faqs = [
    { question: "How do I reset my password?", answer: "You can reset your password by going to Settings > Account > Password, or by clicking 'Forgot Password' on the login page. We'll send you an email with instructions to create a new password." },
    { question: "How can I change my profile picture?", answer: "Navigate to Settings > Account and click on your current profile picture. You can then upload a new image from your device or take a photo." },
    { question: "How do I cancel my Premium subscription?", answer: "Go to Settings > Privacy > Billing and Subscription. Click 'Manage Subscription' and then 'Cancel Subscription'. Your premium features will remain active until the end of your billing period." },
    { question: "Can I export health data?", answer: "Yes! Go to Settings > Privacy and click 'Export Data'. You can download all your workouts, health metrics, and account information as a CSV or JSON file." },
];

export default function SupportPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const router = useRouter();

    // Contact form state
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);
            setContactForm((prev) => ({
                ...prev,
                name: user.user_metadata?.full_name || "",
                email: user.email || "",
            }));
            setLoading(false);
        });
    }, [router, supabase.auth]);

    const handleSignOut = async () => {
        await signOut();
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        alert("Message sent! We'll get back to you soon.");
        setShowContactForm(false);
        setContactForm((prev) => ({ ...prev, subject: "", message: "" }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className="min-h-screen bg-black text-white">
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        {/* User Card */}
                        <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{displayName}</div>
                                    <div className="text-xs text-gray-500">Pro Member</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1 mb-6">
                            {sidebarTabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-zinc-900 hover:text-white transition-colors"
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="border-t border-zinc-800 pt-4 space-y-1">
                            <Link
                                href="/support"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-white transition-colors"
                            >
                                <HelpCircle size={18} />
                                Help & Support
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-accent)] hover:bg-zinc-900 transition-colors"
                            >
                                <LogOut size={18} />
                                Sign out
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {showContactForm ? (
                            /* Contact Form View */
                            <>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold mb-2">Get in touch</h1>
                                    <p className="text-gray-400 text-sm">
                                        Have a question about your workout plan or need technical support?
                                        <br />
                                        We&apos;re here to help you hit your fitness goals. Drop us a message below.
                                    </p>
                                </div>

                                <form onSubmit={handleContactSubmit} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-8">
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                                            <div className="relative">
                                                <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    value={contactForm.name}
                                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Your Email</label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    value={contactForm.email}
                                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-sm text-gray-400 mb-2 block">Subjects</label>
                                        <input
                                            type="text"
                                            placeholder="What is this regarding?"
                                            value={contactForm.subject}
                                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-sm text-gray-400 mb-2 block">Message</label>
                                        <textarea
                                            placeholder="Type your message here...tell us how we can help with your tracking or workouts."
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            rows={6}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowContactForm(false)}
                                            className="px-6 py-3 border border-zinc-700 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            /* Help Center View */
                            <>
                                {/* Title */}
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold mb-2">
                                        How can we help you <span className="text-[var(--color-accent)]">crush your goals?</span>
                                    </h1>
                                    <p className="text-gray-400 text-sm">Find answers, guides and support for your fitness journey. We&apos;re here to keep you moving.</p>
                                </div>

                                {/* Browse by Category */}
                                <div className="mb-10">
                                    <h2 className="text-lg font-bold mb-4">Browse by Category</h2>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-5 text-left hover:border-zinc-700 transition-colors"
                                            >
                                                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-3">
                                                    <category.icon size={20} className="text-[var(--color-accent)]" />
                                                </div>
                                                <h3 className="font-bold text-sm mb-1">{category.label}</h3>
                                                <p className="text-xs text-gray-500">{category.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Popular Questions */}
                                <div className="mb-10 pt-6 border-t border-zinc-800">
                                    <h2 className="text-2xl font-bold mb-2">Popular Questions</h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Can&apos;t find what you&apos;re looking for? check out our{" "}
                                        <Link href="#" className="text-[var(--color-accent)] hover:underline">
                                            full documentation
                                        </Link>
                                        .
                                    </p>

                                    <div className="space-y-3">
                                        {faqs.map((faq, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                                    className="w-full p-5 flex items-center justify-between text-left"
                                                >
                                                    <span className="font-medium text-sm">{faq.question}</span>
                                                    <ChevronDown
                                                        size={18}
                                                        className={`text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                {openFaq === index && (
                                                    <div className="px-5 pb-5 text-sm text-gray-400">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Support */}
                                <div className="pt-6 border-t border-zinc-800">
                                    <h2 className="text-2xl font-bold mb-2">Still need a spotter?</h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Our support team is available Mon-Fri, 9am-6pm EST to help you get back on track.
                                    </p>
                                    <button
                                        onClick={() => setShowContactForm(true)}
                                        className="flex items-center gap-2 px-5 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
                                    >
                                        <Mail size={18} />
                                        Email Support
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
