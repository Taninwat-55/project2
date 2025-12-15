import Nav from "./components/Nav";

export default function Home() {
  return (
    <main className="min-h-screen pb-20 pt-24">
      <Nav />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-12 fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Good Evening, <span className="text-zinc-500">Hedvig</span>
          </h1>
          <p className="text-zinc-400">Time to crush your goals.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-6 hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div className="text-2xl font-bold text-white mb-1">1,248</div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Calories Burned</div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-6 hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div className="text-2xl font-bold text-white mb-1">45 <span className="text-lg text-zinc-500 font-normal">min</span></div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Active Time</div>
            <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%] rounded-full" />
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-6 hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div className="text-2xl font-bold text-white mb-1">3 <span className="text-lg text-zinc-500 font-normal">days</span></div>
            <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Current Streak</div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Recent Activity */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { title: "Upper Body Strength", time: "Today, 9:41 AM", duration: "45 min", kcal: "320" },
                { title: "HIIT Cardio", time: "Yesterday, 6:00 PM", duration: "30 min", kcal: "450" },
                { title: "Yoga Flow", time: "Mon, 7:00 AM", duration: "60 min", kcal: "180" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-zinc-900/50 border border-white/5 p-4 hover:bg-zinc-900 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6" /><path d="M18.657 7.343l-1.414-1.414" /><path d="M5.343 20.657l1.414-1.414" /><path d="M18.657 20.657l-1.414-1.414" /><path d="M5.343 7.343l1.414-1.414" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M2 12h2" /><path d="M20 12h2" /><circle cx="12" cy="12" r="4" /></svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-xs text-zinc-500">{item.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white font-medium">{item.kcal} kcal</div>
                    <div className="text-xs text-zinc-500">{item.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Quick Start</h2>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Ready to sweat?</h3>
                <p className="text-zinc-400 text-sm mb-6">Start your daily scheduled workout now.</p>
                <button className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all">
                  Start Workout
                </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
