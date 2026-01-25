'use client';
import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from './components/SiteHeader'; // Assuming components is relative or use @/
import {
  Activity,
  Utensils,
  BarChart2,
  Users,
  Watch,
  ChevronRight,
  Zap,
  CheckCircle2,
  Dumbbell,
  X,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-x-hidden">
      {/* --- HEADER --- */}
      <SiteHeader fixed={true} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/2 -translate-y-1/4" />

        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Workout & Meal <br />
              <span className="text-[var(--color-accent)]">Tracking</span>
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg md:text-xl max-w-xl leading-relaxed">
              Track your fitness journey with precision. Monitor workouts,
              analyze meal nutrition, and visualize your progress in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-[var(--color-accent)] text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center gap-2"
              >
                Get Started <ChevronRight size={20} />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] font-bold rounded-full hover:bg-[var(--muted)] transition-all flex items-center gap-2"
              >
                Learn More
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap gap-6 text-sm font-bold text-zinc-600 uppercase tracking-wider">
              <span>Fitcore</span>
              <span>Global Fitness</span>
              <span>Nutriful</span>
              <span>Performance Lab</span>
              <span>Wellbeing Lab</span>
            </div>
          </div>

          <div className="relative">
            {/* Hero Image Component */}
            <div className="relative aspect-[4/5] md:aspect-square rounded-[40px] overflow-hidden border border-[var(--border)] bg-[var(--card)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop')",
                }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            {/* Floating Card Decorative */}
            <div className="absolute -bottom-6 -left-6 bg-[var(--card)]/90 backdrop-blur-md p-4 rounded-2xl border border-[var(--border)] shadow-2xl flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  Calories Burned
                </div>
                <div className="text-xl font-bold text-[var(--foreground)]">
                  480 kcal
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FUNCTIONS SECTION --- */}
      <section
        id="features"
        className="py-24 px-6 bg-[var(--card)] border-t border-[var(--border)] relative"
      >
        <div className="max-w-[1400px] mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-[var(--color-accent)]">Functions</span>
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Discover the powerful tools that make your fitness journey seamless
            and effective.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <button
            onClick={() => setShowComingSoon(true)}
            className="bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] p-8 rounded-[32px] transition-all group text-left relative overflow-hidden active:scale-[0.98] cursor-pointer"
          >
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Coming Soon
            </div>

            <div className="w-14 h-14 bg-[var(--muted)] rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
              <Watch size={28} />
            </div>

            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              Connect Devices
            </h3>

            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Seamlessly sync with your Apple Watch, Fitbit, or Garmin. Track
              your heart rate and steps in real-time.
            </p>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => setShowNutritionModal(true)}
            className="bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] p-8 rounded-[32px] transition-all group text-left relative overflow-hidden active:scale-[0.98] cursor-pointer"
          >
            <div className="w-14 h-14 bg-[var(--muted)] rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
              <Utensils size={28} />
            </div>

            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              Food Logging
            </h3>

            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Keep track of your nutrition with our extensive database. Log
              meals and monitor macros to ensure you&apos;re fueling correctly.
            </p>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => setShowAnalyticsModal(true)}
            className="bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] p-8 rounded-[32px] transition-all group text-left relative overflow-hidden active:scale-[0.98] cursor-pointer"
          >
            <div className="w-14 h-14 bg-[var(--muted)] rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
              <BarChart2 size={28} />
            </div>

            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              Performance Analytics
            </h3>

            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Visualize your progress with detailed charts. Analyze your
              strength gains, endurance, and consistency over time.
            </p>
          </button>

          {/* Card 4 */}
          <button
            onClick={() => setShowCommunityModal(true)}
            className="bg-[var(--card)] hover:bg-[var(--muted)] border border-[var(--border)] p-8 rounded-[32px] transition-all group text-left relative overflow-hidden active:scale-[0.98] cursor-pointer"
          >
            <div className="w-14 h-14 bg-[var(--muted)] rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>

            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              Community Support
            </h3>

            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Join challenges and share your achievements. Connect with friends
              and find workout partners to keep you accountable.
            </p>
          </button>
        </div>
      </section>

      {/* --- VALUE PROP SECTION --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orange-900/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[var(--color-accent)] font-bold text-sm tracking-uppercase mb-2">
              WHY CHOOSE NEXUS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{' '}
              <span className="text-[var(--color-accent)]">succeed</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              We provide the tools, you bring the sweat. Our platform is
              designed to handle every aspect of your fitness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--card)] p-8 rounded-[32px] border border-[var(--border)] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-[var(--muted)] rounded-full flex items-center justify-center text-[var(--color-accent)] mb-6">
                <Dumbbell size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Workout Tracking</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Log sets, reps, and weights with ease. Our intelligent systems
                learns your routine and suggests progressive overload targets.
              </p>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-[32px] border border-[var(--border)] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-[var(--muted)] rounded-full flex items-center justify-center text-[var(--color-accent)] mb-6">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Precision Nutrition</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Track macros and calories effortlessly. Access thousands of
                healthy recipes tailored to your dietary preferences and goals.
              </p>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-[32px] border border-[var(--border)] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-[var(--muted)] rounded-full flex items-center justify-center text-[var(--color-accent)] mb-6">
                <BarChart2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Visual Analytics</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                See your progress come to life. Detailed charts and graphs help
                you understand your performance trends over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DATA DRIVEN SECTION --- */}
      <section className="py-24 px-6 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Data-Driven <br />
              <span className="text-[var(--color-accent)]">Performance</span>
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
              Stop guessing and start improving. Nexus transforms your raw data
              into actionable insights. Whether you&apos;re a beginner or an
              elite athlete, knowing your numbers is the key to breaking
              plateaus.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-orange-900/40 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">
                    Real-time Heart Rate Monitoring
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Connect seamlessly with Apple Watch, Garmin, and Fitbit.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-orange-900/40 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">
                    Personalized AI Coaching
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Get daily adjustments to your plan based on your recovery.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-orange-900/40 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--foreground)]">
                    Community Challenges
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Compete with friends and stay motivated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Simulated Dashboard UI */}
            <div className="relative bg-[var(--card)] rounded-[32px] border border-[var(--border)] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-bold">Weekly Activity</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    High intensity focus
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center text-[var(--color-accent)]">
                  <Zap size={20} fill="currentColor" />
                </div>
              </div>

              {/* Bar Chart Bars */}
              <div className="flex items-end gap-3 h-48 mb-6">
                <div className="w-full bg-[var(--muted)]/50 rounded-t-lg h-[40%]" />
                <div className="w-full bg-[var(--muted)]/50 rounded-t-lg h-[60%]" />
                <div className="w-full bg-[var(--color-accent)] rounded-t-lg h-[85%] shadow-[0_0_20px_rgba(249,86,16,0.3)]" />
                <div className="w-full bg-[var(--muted)]/50 rounded-t-lg h-[50%]" />
                <div className="w-full bg-[var(--muted)]/50 rounded-t-lg h-[75%]" />
                <div className="w-full bg-[var(--muted)]/50 rounded-t-lg h-[45%]" />
              </div>

              {/* Bottom Stat */}
              <div className="bg-[var(--background)] rounded-full p-4 flex items-center justify-between border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <Utensils size={14} />
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Post-Workout Meal
                    </span>
                    <div className="w-24 h-1.5 bg-[var(--muted)] rounded-full mt-1 overflow-hidden">
                      <div className="bg-green-500 h-full w-[80%]" />
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold">
                  650{' '}
                  <span className="text-[var(--muted-foreground)] font-sans font-normal">
                    kCal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showComingSoon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Animated Icon Container */}
              <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-6 animate-pulse">
                <Watch size={40} />
              </div>

              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
                Feature <span className="text-orange-500">Incoming</span>
              </h2>

              <p className="text-zinc-400 leading-relaxed mb-8">
                We are currently building direct integrations with{' '}
                <span className="text-white font-bold">
                  Apple Health, Fitbit, and Garmin
                </span>
                . Soon, your workouts and daily steps will sync automatically to
                your dashboard.
              </p>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50 text-xs font-bold text-zinc-300">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  Development in progress...
                </div>

                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all active:scale-95"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      {showNutritionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNutritionModal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-6">
                <Utensils size={40} />
              </div>

              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
                Smart <span className="text-orange-500">Nutrition</span>
              </h2>

              <p className="text-zinc-400 leading-relaxed mb-8">
                Ready to log your next meal? Access your personalized dashboard
                to track calories, macros, and set nutrition goals.
              </p>

              <div className="w-full space-y-3">
                {/* THIS IS THE LINK TO YOUR NUTRITION PAGE */}
                <Link
                  href="/nutrition"
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                >
                  Open Nutrition Tracker
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  onClick={() => setShowNutritionModal(false)}
                  className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowNutritionModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {showAnalyticsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAnalyticsModal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-6">
                <BarChart2 size={40} />
              </div>

              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
                Visual <span className="text-orange-500">Insights</span>
              </h2>

              <p className="text-zinc-400 leading-relaxed mb-8">
                Ready to see how far you&apos;ve come? View your{' '}
                <span className="text-white font-bold">consistency score</span>{' '}
                and volume charts on your main dashboard.
              </p>

              <div className="w-full space-y-3">
                {/* LINK TO DASHBOARD */}
                <Link
                  href="/dashboard"
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                >
                  View Dashboard
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                >
                    Maybe Later
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAnalyticsModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {showCommunityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCommunityModal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-6">
                <Users size={40} />
              </div>

              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
                Join the <span className="text-orange-500">Community</span>
              </h2>

              <p className="text-zinc-400 leading-relaxed mb-8">
                Fitness is better together. Join{' '}
                <span className="text-white font-bold">
                  community challenges
                </span>
                , track friends, and stay motivated with global leaderboards.
              </p>

              <div className="w-full space-y-3">
                {/* LINK TO COMMUNITY */}
                <Link
                  href="/community"
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                >
                  Enter Community
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  onClick={() => setShowCommunityModal(false)}
                  className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowCommunityModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
