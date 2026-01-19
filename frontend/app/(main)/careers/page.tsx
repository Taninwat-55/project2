"use client";

import { useState } from "react";
import {
  Briefcase, MapPin, Globe, Rocket, Heart,
  Zap, ArrowUpRight, X, CheckCircle2, Send, Loader2
} from "lucide-react";

const jobs = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / London",
    type: "Full-time",
  },
  {
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Fitness Content Specialist",
    department: "Content",
    location: "Hybrid / New York",
    type: "Contract",
  },
  {
    title: "Data Scientist (Performance AI)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
];

const values = [
  {
    icon: <Heart className="text-orange-500" />,
    title: "Health First",
    desc: "We practice what we preach. Flexible hours for workouts and mental health days.",
  },
  {
    icon: <Zap className="text-orange-500" />,
    title: "High Velocity",
    desc: "We move fast, ship daily, and iterate based on real user performance data.",
  },
  {
    icon: <Globe className="text-orange-500" />,
    title: "Remote Culture",
    desc: "Work from anywhere. We value output and impact over hours spent in a chair.",
  },
];

export default function CareersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Function to open modal and set which job the user is applying for
  const openApplication = (jobTitle: string | null = "General Application") => {
    setSelectedJob(jobTitle);
    setIsModalOpen(true);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setSelectedJob(null);
      }, 3500);
    }, 1500);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white relative">

        {/* --- APPLICATION MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />

            <div className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {!isSuccess ? (
                <>
                  <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Apply for Role</h3>
                  <p className="text-gray-400 mb-8 text-sm">
                    You are applying for: <span className="text-orange-500 font-bold">{selectedJob}</span>
                  </p>

                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-orange-600 outline-none transition-colors" />
                      <input required type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-orange-600 outline-none transition-colors" />
                    </div>
                    <input required type="url" placeholder="LinkedIn or Portfolio URL" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-orange-600 outline-none transition-colors" />
                    <textarea required rows={3} placeholder="Why are you a good fit for Nexus?" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-orange-600 outline-none transition-colors resize-none" />

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-4 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Application</>}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                  <p className="text-gray-400">
                    Thanks for your interest in joining Nexus. Our team will review your profile and reach out if it&apos;s a match.
                  </p>
                  <p className="text-orange-500 text-sm font-bold mt-8">Keep pushing boundaries.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6 border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
              <Rocket size={14} /> Join the Revolution
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Help us build the future of <span className="text-orange-600">human potential.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              We’re looking for obsessed builders, designers, and fitness enthusiasts to help us redefine how the world trains.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v) => (
                <div key={v.title} className="bg-[#111] border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs List Section */}
        <section className="py-20 px-6 bg-[#050505]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <span className="text-gray-500 text-sm font-medium">{jobs.length} Opportunities</span>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.title}
                  onClick={() => openApplication(job.title)}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#111] border border-white/5 rounded-3xl hover:border-orange-600/50 transition-all cursor-pointer"
                >
                  <div className="mb-4 md:mb-0">
                    <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1">{job.department}</div>
                    <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
                    Apply Now <ArrowUpRight size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Talent Pool CTA */}
            <div className="mt-16 text-center p-12 bg-orange-600/5 border border-orange-600/10 rounded-[3rem] hover:bg-orange-600/10 transition-colors">
              <h3 className="text-2xl font-bold mb-4">Don&apos;t see a fit?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                We&apos;re always looking for exceptional talent. Join our talent pool and be the first to know when a new role opens.
              </p>
              <button
                onClick={() => openApplication("General Talent Pool")}
                className="text-orange-500 font-bold hover:underline flex items-center gap-2 mx-auto"
              >
                Send a General Application <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}