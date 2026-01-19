import { Scale, AlertTriangle, CreditCard, UserX, FileText, HeartPulse } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: <Scale className="text-orange-500" />,
    title: "1. Acceptance of Terms",
    content: "By creating an account or using the Nexus Fitness app, you agree to be bound by these Terms. If you do not agree, you may not use our services."
  },
  {
    icon: <HeartPulse className="text-orange-500" />,
    title: "2. Health & Medical Disclaimer",
    content: "Nexus is a fitness tracking tool, not a medical provider. You should consult with a healthcare professional before starting any exercise program. You perform all workouts at your own risk. Nexus is not responsible for any physical injury or health problems you may experience."
  },
  {
    icon: <CreditCard className="text-orange-500" />,
    title: "3. Subscriptions & Payments",
    content: "Pro memberships are billed on a recurring monthly or annual basis. You can cancel anytime through your account settings. Refunds are handled on a case-by-case basis as per our refund policy."
  },
  {
    icon: <UserX className="text-orange-500" />,
    title: "4. User Conduct & Termination",
    content: "We reserve the right to suspend or terminate your account if you misuse the platform, attempt to scrape data, or engage in behavior that harms the community or our servers."
  },
  {
    icon: <FileText className="text-orange-500" />,
    title: "5. Intellectual Property",
    content: "All content, including branding, UI design, and proprietary algorithms, are the property of Nexus. You are granted a limited, non-exclusive license to use the app for personal, non-commercial use."
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="pt-24 pb-16 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-gray-400 text-lg">
            Effective Date: January 20, 2026. Please read these terms carefully.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* High Alert Liability Box */}
          <div className="bg-orange-600/10 border border-orange-600/30 p-8 rounded-[2rem] mb-12">
            <div className="flex items-center gap-3 text-orange-500 mb-4">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold uppercase tracking-wider">Medical Warning</h2>
            </div>
            <p className="text-gray-300 leading-relaxed italic">
              &quot;The use of Nexus involves physical activity which carries an inherent risk of injury. By using this service, you acknowledge these risks and agree that Nexus, its creators, and affiliates are not liable for any damages or injuries resulting from your use of the app.&quot;
            </p>
          </div>

          {/* Sections Mapping */}
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:w-1/3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/5 rounded-lg">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer of Content */}
          <div className="mt-24 pt-12 border-t border-white/5 text-center text-gray-500 text-sm">
            <p className="mb-4">Need a physical copy or have a legal inquiry?</p>
            <Link href="mailto:legal@nexusfit.com" className="text-orange-500 font-bold hover:underline">
              Contact Legal Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}