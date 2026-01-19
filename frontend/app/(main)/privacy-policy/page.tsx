import { ShieldCheck, Lock, Eye, FileText, Smartphone, Database, Mail } from "lucide-react";

const sections = [
  {
    id: "data-collection",
    icon: <Eye className="text-orange-500" />,
    title: "Data We Collect",
    content: "We collect information you provide directly to us, such as your name, email, workout logs, and nutritional data. We also automatically collect device information and app usage statistics to improve your experience."
  },
  {
    id: "data-usage",
    icon: <Database className="text-orange-500" />,
    title: "How We Use Data",
    content: "Your data is used to provide personalized fitness insights, track your progress over time, and send you important app updates. We do NOT sell your personal health data to third-party advertisers."
  },
  {
    id: "security",
    icon: <Lock className="text-orange-500" />,
    title: "Data Security",
    content: "We use industry-standard encryption (AES-256) to protect your data both at rest and in transit. Your password is hashed and never stored in plain text."
  },
  {
    id: "sharing",
    icon: <Smartphone className="text-orange-500" />,
    title: "Third-Party Services",
    content: "We may share data with service providers who help us with hosting (like Vercel/Supabase) or analytics. These partners are legally bound to protect your data."
  }
];

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-black text-white">
        {/* Hero Header */}
        <section className="pt-24 pb-16 px-6  from-orange-600/10 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-gray-400 text-lg">
              Last Updated: January 20, 2026. We value your trust and are committed to protecting your personal information.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">

            {/* Quick Summary Card */}
            <div className="bg-[#111] border border-orange-600/30 p-8 rounded-[2rem] mb-16 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FileText size={20} className="text-orange-500" /> The &quot;Too Long; Didn&apos;t Read&quot;
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We collect your workout data to help you get fit. We don&apos;t sell your data to strangers. We keep your information locked down with high-level encryption. You own your data and can delete it anytime.
                </p>
              </div>
              <div className="h-px md:h-20 w-full md:w-px bg-white/10" />
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Have Questions?</p>
                <a href="mailto:privacy@nexusfit.com" className="text-lg font-bold flex items-center justify-center md:justify-start gap-2 hover:text-orange-500 transition-colors">
                  <Mail size={20} /> privacy@nexusfit.com
                </a>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 gap-12">
              {sections.map((s) => (
                <div key={s.id} className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-orange-600/10 transition-colors">
                      {s.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{s.title}</h2>
                  </div>
                  <div className="pl-16">
                    <p className="text-gray-400 leading-relaxed">
                      {s.content}
                    </p>
                  </div>
                  <div className="mt-12 h-px bg-white/5 w-full" />
                </div>
              ))}
            </div>

            {/* User Rights Section */}
            <div className="mt-20 p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Request a copy of your data",
                  "Update incorrect information",
                  "Delete your account and all data",
                  "Opt-out of marketing emails"
                ].map((right) => (
                  <div key={right} className="flex items-start gap-3 text-gray-300">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                    <span className="text-sm font-medium">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}