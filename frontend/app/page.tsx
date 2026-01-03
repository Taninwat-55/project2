import Link from "next/link";
// import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 pt-20 pb-32 bg-radial-gradient from-zinc-900 to-background overflow-hidden relative">
        
        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />

        <div className="space-y-6 max-w-3xl relative z-10 animate-fade-in-up">
          <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-400 mb-4 backdrop-blur-sm">
            🚀 The Ultimate Fitness Companion
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Crush Your Goals. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-lime-500">
              Own Your Health.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Track your workouts, log your meals, and visualize your progress with 
            the most intuitive fitness tracker built for peak performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-lime-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              Get Started Now
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium text-lg hover:bg-zinc-800 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-zinc-900/30 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need</h2>
            <p className="text-zinc-400">Streamlined tools to keep you focused on what matters.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Tracking</h3>
              <p className="text-zinc-400 leading-relaxed">
                Log workouts and meals in seconds. We handle the math so you can handle the weights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Analytics</h3>
              <p className="text-zinc-400 leading-relaxed">
                Visualize your calorie intake and burn rate with beautiful, interactive charts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-zinc-900 border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Goal Setting</h3>
              <p className="text-zinc-400 leading-relaxed">
                Set daily targets for calories and activity. We wll keep you accountable every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-linear-to-br from-zinc-900 to-zinc-950 border border-white/10 p-12 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
           
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
             Ready to transform your body?
           </h2>
           <p className="text-zinc-400 mb-8 max-w-xl mx-auto relative z-10">
             Join thousands of users who are taking control of their fitness journey today.
           </p>
           <Link
              href="/login"
              className="inline-block px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors relative z-10"
            >
              Start Your Free Trial
            </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-500 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} FitnessApp. All rights reserved.</p>
      </footer>
    </div>
  );
}