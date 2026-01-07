"use client";
import Image from "next/image";
import Link from "next/link";
import { 
  Dumbbell, 
  Users, 
  Flame, 
  Flag, 
  Eye, 
  ShieldCheck, 
  TrendingUp,
  Heart,
  ChevronRight
} from "lucide-react";
// Path points to your SiteHeader.tsx file in app/components
import SiteHeader from "@/app/components/SiteHeader"; 

export default function AboutPage() {
  const stats = [
    { 
      icon: <Dumbbell className="text-orange-500" size={32} />, 
      label: "Workouts Tracked", 
      value: "1M+" 
    },
    { 
      icon: <Users className="text-orange-500" size={32} />, 
      label: "Active Users", 
      value: "50K+" 
    },
    { 
      icon: <Flame className="text-orange-500" size={32} />, 
      label: "Calories Burned", 
      value: "500M+" 
    },
  ];

  const team = [
    { 
      name: "Sarah Jenkins", 
      role: "CEO & Founder", 
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      name: "David Svensson", 
      role: "CTO", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      name: "Elina Lundberg", 
      role: "Head of Product", 
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      name: "Marcus Johnson", 
      role: "Lead IT", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" 
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      <SiteHeader fixed={true} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 text-center">
        {/* Background Image Container with your requested photo */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full opacity-40 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?q=80&w=1740&auto=format&fit=crop')",
              maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-tight">
            Empowering <br />
            Your <span className="text-orange-500">Every Step</span>
          </h1>
          <div className="pt-4">
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
            >
              Join the Empowering <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[40px] text-center space-y-4 hover:border-orange-500/30 transition-colors">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              <h2 className="text-5xl font-extrabold tracking-tighter">{stat.value}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* --- PURPOSE SECTION --- */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Our Purpose</h2>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            Driven by data, inspired by you. We are more than just a workout app, 
            we are your partner in the pursuit of a better health.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[40px] space-y-6 group hover:bg-zinc-900/50 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                <Flag className="text-orange-500" size={28} />
            </div>
            <h3 className="text-3xl font-bold">Our Mission</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              To make Nexus lifestyle accessible to everyone, regardless of their starting point 
              by demystifying health data.
            </p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[40px] space-y-6 group hover:bg-zinc-900/50 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                <Eye className="text-orange-500" size={28} />
            </div>
            <h3 className="text-3xl font-bold">Our Vision</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              To create a world where personal health data empowers every decision you make, 
              fostering a healthier global community.
            </p>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Core Values</h2>
            <p className="text-zinc-500 text-lg">The principles that guide our product and our team.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={24} />, title: "Accuracy", desc: "Precision in every metric we track for our users." },
              { icon: <Heart size={24} />, title: "Community", desc: "We grow stronger when we work together towards health goals." },
              { icon: <TrendingUp size={24} />, title: "Growth", desc: "Better than yesterday, every single day." }
            ].map((value, i) => (
              <div key={i} className="bg-zinc-900/20 border border-zinc-800/50 p-10 rounded-[40px] space-y-4">
                <div className="text-orange-500">{value.icon}</div>
                <h4 className="font-bold text-2xl">{value.title}</h4>
                <p className="text-zinc-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MEET THE TEAM --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Meet the Team</h2>
            <p className="text-zinc-500 text-lg">The fitness enthusiasts and engineers behind the screen.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <div key={i} className="group text-left">
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-6">
                  <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-6">
  <Image 
    src={member.image} 
    alt={member.name} 
    fill // This removes the need for width/height props
    sizes="(max-width: 768px) 100vw, 25vw" // Tells Next.js how much space it takes
    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
  />
</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
                <h4 className="font-bold text-xl mb-1">{member.name}</h4>
                <p className="text-orange-500 font-bold uppercase tracking-wider text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 text-sm">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-xl">
                    N
                </div>
                <span className="font-bold text-2xl tracking-wide">Nexus</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed text-base">
                Empowering athletes everywhere to reach their peak performance through data and discipline.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-8">Product</h5>
            <ul className="text-zinc-500 space-y-4 text-base">
              <li><Link href="#" className="hover:text-orange-500">Features</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Testimonials</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-8">Company</h5>
            <ul className="text-zinc-500 space-y-4 text-base">
              <li><Link href="/about" className="hover:text-orange-500">About Us</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-8">Support</h5>
            <ul className="text-zinc-500 space-y-4 text-base">
              <li><Link href="#" className="hover:text-orange-500">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-24 pt-8 border-t border-zinc-900/50 text-zinc-600">
            &copy; {new Date().getFullYear()} Nexus Fitness App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}