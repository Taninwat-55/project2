import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Header */}
            <header className="relative z-20 flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1400px] mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors">
                            N
                        </div>
                        <span className="font-bold text-xl tracking-wide text-white">Nexus</span>
                    </Link>
                </div>

                <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                    <Link href="#" className="hover:text-white transition-colors">Workout</Link>
                    <Link href="#" className="hover:text-white transition-colors">Meal-Plans</Link>
                    <Link href="#" className="hover:text-white transition-colors">Data</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-bold text-white hover:text-gray-300 transition-colors">Log In</Link>
                    <Link href="/signup" className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Sign Up</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4">

                <div className="w-full max-w-[480px] p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl">
                    <div className="w-full h-full bg-[#0c0c0e] rounded-[31px] p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-md relative overflow-hidden">

                        {/* Internal Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[var(--color-accent)]/5 rounded-full blur-[50px] pointer-events-none" />

                        <div className="text-left mb-8 relative z-10">
                            <h1 className="text-3xl font-bold text-white mb-3">Forget Password?</h1>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Don&apos;t worry, it happens. Enter the email associated with your account and we&apos;ll send you a link to reset your password.
                            </p>
                        </div>

                        <form className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[var(--color-accent)] transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="you@nexus.fit"
                                        className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-12 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--color-accent)] text-white font-bold py-3.5 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 active:scale-[0.98]"
                            >
                                Send the reset Link
                            </button>
                        </form>

                        <div className="mt-8 text-center relative z-10">
                            <p className="text-sm text-gray-400">
                                Remember your password? <Link href="/login" className="text-[var(--color-accent)] font-semibold hover:underline">Log in</Link>
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
