import { ContactForm } from "@/app/components/contact-form";
import { ContactInfo } from "@/app/components/contact-info";
import PageTransition from "@/components/page-transition"; // [1] Import the wrapper

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      
      {/* [2] Wrap the main content area */}
      <PageTransition>
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
              Have a question about your workout plan or need technical support?
              We&apos;re here to help you hit your fitness goals. Drop us a message below.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-6 md:p-10">
              <ContactForm />
            </div>

            {/* Right: Info Cards */}
            <div className="flex flex-col gap-6">
              <ContactInfo />
            </div>
          </div>
        </main>
      </PageTransition>

    </div>
  );
}