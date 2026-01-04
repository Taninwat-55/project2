import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import SiteHeader from "@/app/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder for gym background - using a dark gradient overlay for now as per plan */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-slate-900)_0%,_#000000_100%)] opacity-80 z-10"></div>
        {/* If we had the image, it would go here. Using a placeholder div to represent the gym feel */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop')", // Free gym image from Unsplash
          }}
        ></div>
        {/* Darker overlay on top to match the design's darkness */}
        <div className="absolute inset-0 bg-black/60 z-10 transition-colors"></div>
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 w-full">
        <div className="w-full max-w-[480px] p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl">
          <div className="w-full h-full bg-black/40 rounded-[31px] p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-md">

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Enter your credentials to access your dashboard</p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 ml-1">Your Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[var(--color-accent)] transition-colors" />
                  <input
                    type="email"
                    placeholder="you@nexus.fit"
                    className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-12 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-gray-300">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-[var(--color-accent)] hover:underline">Forgot your password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[var(--color-accent)] transition-colors" />
                  <input
                    type="password"
                    placeholder="●●●●●●●●"
                    className="w-full bg-[#1c1c1e] text-white text-sm rounded-xl py-3.5 pl-12 pr-4 border border-zinc-800 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-zinc-600 tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--color-accent)] text-white font-bold py-3.5 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                Log In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-2">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#09090b]/80 backdrop-blur text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1c1c1e] hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group">
                {/* Google Icon */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1c1c1e] hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors group">
                {/* Apple Icon */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 19.36c.99 1.37 1.48 2.25 1.08 3.55-.26.85-.75 1.7-1.34 2.38-.97 1.1-1.91 1.69-3.3 1.73-1.2.03-2.21-.71-2.92-.71-.7 0-1.87.69-2.94.75-1.49.08-2.74-1.07-3.8-2.58-1.9-2.72-2.12-6.52-.3-9 .89-1.2 2.37-2.07 3.84-2.17 1.07-.07 2.04.57 2.68.57.64 0 1.94-.72 2.97-.64.55.03 2.15.22 3.19 1.74-.08.06-1.9 1.11-1.87 3.33.02 2.64 2.34 3.55 2.38 3.58-.02.09-1.37 4.14-2.85 6.27l.18.23zM15.48 3.51c.76-.92 1.25-2.18 1.1-3.41-1.09.04-2.4.73-3.17 1.63-.7.82-1.3 2.15-1.14 3.4 1.21.09 2.45-.7 3.21-1.62z" />
                </svg>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Apple</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account? <Link href="/signup" className="text-[var(--color-accent)] font-semibold hover:underline">Sign up for free</Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-6 flex justify-center gap-8 text-xs text-gray-500">
        <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-gray-300 transition-colors">Contact Support</Link>
      </footer>
    </div>
  );
}
