"use client";

import Link from "next/link";
import { Eye, EyeOff, CheckCircle2, Mail } from "lucide-react";
import { useState, useActionState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import { signup } from "../actions";

const initialState = {
    success: false,
    error: ""
};

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [state, dispatch, isPending] = useActionState(signup, initialState);

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-x-hidden">
            {/* Background Gradient for overall page warmth */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">

                <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 md:gap-4 items-stretch">

                    {/* Left Side - Image Card */}
                    <div className="hidden md:flex relative rounded-[32px] overflow-hidden min-h-[600px] bg-zinc-900">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop')", // Gym/Crossfit image
                            }}
                        ></div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                        <div className="relative z-10 mt-auto p-12 text-left">
                            <h2 className="text-4xl font-bold text-white mb-2 leading-tight">Push your limits.</h2>
                            <h2 className="text-4xl font-bold text-[var(--color-accent)] mb-4 leading-tight">Track your progress</h2>
                            <p className="text-gray-300 max-w-md bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                                Join the thousands of athletes achieving their fitness goals with Nexus.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form Card or Success Message */}
                    <div className="bg-[#0c0c0e] border border-white/5 rounded-[32px] p-8 md:p-12 flex flex-col justify-center relative backdrop-blur-sm">

                        {state?.success ? (
                            <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white">Check your email</h1>
                                    <p className="text-gray-400 max-w-sm mx-auto">
                                        We&apos;ve sent a confirmation link to your email address. Please click the link to activate your account.
                                    </p>
                                </div>

                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 flex items-center gap-3 w-full max-w-sm">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">Can&apos;t find the email?</p>
                                        <p className="text-xs text-gray-500">Check your spam folder or try again.</p>
                                    </div>
                                </div>

                                <div className="pt-6 w-full max-w-sm space-y-3">
                                    <Link
                                        href="/login"
                                        className="block w-full bg-[var(--color-accent)] text-white font-bold py-4 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 text-sm"
                                    >
                                        Go to Login
                                    </Link>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="block w-full text-zinc-500 hover:text-white text-xs transition-colors"
                                    >
                                        Use a different email address
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-white mb-2">Join Nexus Join Movment</h1>
                                    <p className="text-gray-500 text-sm">Start your fitness journey today. It&apos;s free!</p>
                                </div>

                                {state?.error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                        {state.error}
                                    </div>
                                )}

                                <form className="space-y-5" action={dispatch}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300 ml-1">Full Name</label>
                                        <input
                                            name="fullName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 px-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300 ml-1">Email address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 px-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300 ml-1">Password</label>
                                        <div className="relative group">
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-4 pr-12 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors outline-none"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300 ml-1">Confirm password</label>
                                        <div className="relative group">
                                            <input
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Repeat your password"
                                                className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-4 pr-12 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors outline-none"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="text-xs text-gray-500">
                                            I agree to the <Link href="#" className="text-[var(--color-accent)] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-[var(--color-accent)] text-white font-bold py-4 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? "Creating Account..." : "Create Account"}
                                    </button>
                                </form>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-zinc-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-4 bg-[#0c0c0e] text-gray-500">Or Sign up with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1c1c1e] hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group">
                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">Google</span>
                                    </button>
                                    <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1c1c1e] hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group">
                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.05 19.36c.99 1.37 1.48 2.25 1.08 3.55-.26.85-.75 1.7-1.34 2.38-.97 1.1-1.91 1.69-3.3 1.73-1.2.03-2.21-.71-2.92-.71-.7 0-1.87.69-2.94.75-1.49.08-2.74-1.07-3.8-2.58-1.9-2.72-2.12-6.52-.3-9 .89-1.2 2.37-2.07 3.84-2.17 1.07-.07 2.04.57 2.68.57.64 0 1.94-.72 2.97-.64.55.03 2.15.22 3.19 1.74-.08.06-1.9 1.11-1.87 3.33.02 2.64 2.34 3.55 2.38 3.58-.02.09-1.37 4.14-2.85 6.27l.18.23zM15.48 3.51c.76-.92 1.25-2.18 1.1-3.41-1.09.04-2.4.73-3.17 1.63-.7.82-1.3 2.15-1.14 3.4 1.21.09 2.45-.7 3.21-1.62z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">Apple</span>
                                    </button>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="text-sm text-gray-400">
                                        Already have a account? <Link href="/login" className="text-[var(--color-accent)] font-semibold hover:underline">Login here</Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
