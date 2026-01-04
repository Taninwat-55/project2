"use client";

import Link from "next/link";
import {
    Activity,
    Utensils,
    BarChart2,
    Users,
    Watch,
    ChevronRight,
    Zap,
    CheckCircle2,
    Dumbbell
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">

            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-lg group-hover:bg-[var(--color-accent)] group-hover:text-black transition-colors">
                            N
                        </div>
                        <span className="font-bold text-xl tracking-wide text-white">Nexus</span>
                    </Link>

                    <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#meal-plans" className="hover:text-white transition-colors">Meal-Plans</Link>
                        <Link href="#data" className="hover:text-white transition-colors">Data</Link>
                    </nav>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-bold text-white hover:text-gray-300 transition-colors">Log In</Link>
                        <Link href="/signup" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Sign Up</Link>
                    </div>
                </div>
            </header>

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
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
                            Track your fitness journey with precision. Monitor workouts, analyze meal nutrition, and visualize your progress in real-time.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/signup" className="px-8 py-4 bg-[var(--color-accent)] text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center gap-2">
                                Get Started <ChevronRight size={20} />
                            </Link>
                            <Link href="#features" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-full hover:bg-zinc-800 transition-all flex items-center gap-2">
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
                        <div className="relative aspect-[4/5] md:aspect-square rounded-[40px] overflow-hidden border border-white/5 bg-zinc-900">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop')" }}
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        </div>

                        {/* Floating Card Decorative */}
                        <div className="absolute -bottom-6 -left-6 bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 animate-bounce-slow">
                            <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white">
                                <Activity size={24} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400">Calories Burned</div>
                                <div className="text-xl font-bold text-white">480 kcal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- FUNCTIONS SECTION --- */}
            <section id="features" className="py-24 px-6 bg-zinc-950 border-t border-white/5 relative">
                <div className="max-w-[1400px] mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-[var(--color-accent)]">Functions</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Discover the powerful tools that make your fitness journey seamless and effective.
                    </p>
                </div>

                <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-6">

                    {/* Card 1 */}
                    <div className="bg-[#0c0c0e] hover:bg-zinc-900 border border-white/5 p-8 rounded-[32px] transition-colors group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-[var(--color-accent)] mb-6 group-hover:scale-110 transition-transform">
                            <Watch size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Connect Devices</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Seamlessly sync with your Apple Watch, Fitbit, or Garmin. Track your heart rate, steps, and workout intensity in real-time directly within the app interface.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#0c0c0e] hover:bg-zinc-900 border border-white/5 p-8 rounded-[32px] transition-colors group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-[var(--color-accent)] mb-6 group-hover:scale-110 transition-transform">
                            <Utensils size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Food Logging</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Keep track of your nutrition with our extensive database. Scan barcodes, log meals, and monitor your macro intake to ensure you're fueling your body correctly.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#0c0c0e] hover:bg-zinc-900 border border-white/5 p-8 rounded-[32px] transition-colors group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-[var(--color-accent)] mb-6 group-hover:scale-110 transition-transform">
                            <BarChart2 size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Performance Analytics</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Visualize your progress with detailed charts. Analyze your strength gains, endurance improvements, and consistency over time to stay motivated.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-[#0c0c0e] hover:bg-zinc-900 border border-white/5 p-8 rounded-[32px] transition-colors group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-[var(--color-accent)] mb-6 group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Community Support</h3>
                        <p className="text-zinc-500 leading-relaxed">
                            Join challenges and share your achievements. Connect with friends and find workout partners to keep you accountable on your fitness journey.
                        </p>
                    </div>

                </div>
            </section>

            {/* --- VALUE PROP SECTION --- */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orange-900/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[var(--color-accent)] font-bold text-sm tracking-uppercase mb-2">WHY CHOOSE NEXUS</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to <span className="text-[var(--color-accent)]">succeed</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We provide the tools, you bring the sweat. Our platform is designed to handle every aspect of your fitness journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#121214] p-8 rounded-[32px] border border-white/5 text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-[var(--color-accent)] mb-6">
                                <Dumbbell size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Smart Workout Tracking</h3>
                            <p className="text-sm text-gray-500">Log sets, reps, and weights with ease. Our intelligent systems learns your routine and suggests progressive overload targets.</p>
                        </div>
                        <div className="bg-[#121214] p-8 rounded-[32px] border border-white/5 text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-[var(--color-accent)] mb-6">
                                <Utensils size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Precision Nutrition</h3>
                            <p className="text-sm text-gray-500">Track macros and calories effortlessly. Access thousands of healthy recipes tailored to your dietary preferences and goals.</p>
                        </div>
                        <div className="bg-[#121214] p-8 rounded-[32px] border border-white/5 text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-[var(--color-accent)] mb-6">
                                <BarChart2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Visual Analytics</h3>
                            <p className="text-sm text-gray-500">See your progress come to life. Detailed charts and graphs help you understand your performance trends over time.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- DATA DRIVEN SECTION --- */}
            <section className="py-24 px-6 bg-black border-t border-white/5">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">

                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Data-Driven <br />
                            <span className="text-[var(--color-accent)]">Performance</span>
                        </h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Stop guessing and start improving. Nexus transforms your raw data into actionable insights. Whether you're a beginner or an elite athlete, knowing your numbers is the key to breaking plateaus.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-orange-900/40 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Real-time Heart Rate Monitoring</h4>
                                    <p className="text-sm text-gray-500">Connect seamlessly with Apple Watch, Garmin, and Fitbit.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-orange-900/40 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Personalized AI Coaching</h4>
                                    <p className="text-sm text-gray-500">Get daily adjustments to your plan based on your recovery.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-orange-900/40 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Community Challenges</h4>
                                    <p className="text-sm text-gray-500">Compete with friends and stay motivated.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Simulated Dashboard UI */}
                        <div className="relative bg-[#0c0c0e] rounded-[32px] border border-white/5 p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h4 className="font-bold">Weekly Activity</h4>
                                    <p className="text-xs text-gray-500">High intensity focus</p>
                                </div>
                                <div className="w-10 h-10 bg-orange-900/20 rounded-lg flex items-center justify-center text-[var(--color-accent)]">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                            </div>

                            {/* Bar Chart Bars */}
                            <div className="flex items-end gap-3 h-48 mb-6">
                                <div className="w-full bg-zinc-800/50 rounded-t-lg h-[40%]" />
                                <div className="w-full bg-zinc-800/50 rounded-t-lg h-[60%]" />
                                <div className="w-full bg-[var(--color-accent)] rounded-t-lg h-[85%] shadow-[0_0_20px_rgba(249,86,16,0.3)]" />
                                <div className="w-full bg-zinc-800/50 rounded-t-lg h-[50%]" />
                                <div className="w-full bg-slate-700/50 rounded-t-lg h-[75%]" />
                                <div className="w-full bg-slate-700/50 rounded-t-lg h-[45%]" />
                            </div>

                            {/* Bottom Stat */}
                            <div className="bg-black rounded-full p-4 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                        <Utensils size={14} />
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-gray-400">Post-Workout Meal</span>
                                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                            <div className="bg-green-500 h-full w-[80%]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-mono font-bold">
                                    650 <span className="text-gray-500 font-sans font-normal">kCal</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-20 px-6 border-t border-white/5 bg-black">
                <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-12">

                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">
                                N
                            </div>
                            <span className="font-bold text-lg tracking-wide text-white">Nexus</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Empowering athletes everywhere to reach their peak performance through data and discipline.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Testimonials</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Integration</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-[var(--color-accent)] transition-colors">Status</Link></li>
                        </ul>
                    </div>

                </div>
                <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} Nexus Fitness App. All rights reserved.
                </div>
            </footer>

        </div>
    );
}
