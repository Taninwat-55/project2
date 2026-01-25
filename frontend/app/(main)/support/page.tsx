'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Dumbbell,
  Bell,
  Shield,
  Monitor,
  HelpCircle,
  LogOut,
  Rocket,
  Smartphone,
  ClipboardList,
  Apple,
  CreditCard,
  Settings,
  ChevronDown,
  Mail,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { signOut } from '@/app/(auth)/actions';

// Updated categories with specific "how-to" information
const categories = [
  {
    id: 'getting-started',
    label: 'Getting started',
    description: 'Set up your account and profile basics.',
    icon: Rocket,
    steps: [
      'Complete your physical profile in Settings',
      'Set your weekly workout frequency goal',
      "Follow the 'First Day' guided tutorial",
    ],
    longText:
      'Welcome to Nexus! To get the most out of your journey, start by filling in your biometric data. This allows our AI to calculate your recovery needs accurately.',
  },
  {
    id: 'device-syncing',
    label: 'Device Syncing',
    description: 'Pair your watch or tracker easily.',
    icon: Smartphone,
    steps: [
      'Enable Bluetooth on your mobile device',
      "Grant Nexus 'Read' permissions in HealthKit/Google Fit",
      'Sync your device before every workout',
    ],
    longText:
      "Nexus integrates seamlessly with Apple Watch, Garmin, and Whoop. Ensure your health permissions are toggled 'On' to see real-time heart rate data.",
  },
  {
    id: 'workout-plans',
    label: 'Workout and Plans',
    description: 'Logging exercises and creating routines.',
    icon: ClipboardList,
    steps: [
      "Browse the 'Pro' library for pre-made plans",
      "Use 'Custom Mode' to build your own split",
      'Record your RPE after every set for better tracking',
    ],
    longText:
      'Your routines are the heart of your progress. You can swap exercises on the fly or save high-intensity circuits to your favorites for quick access.',
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    description: 'Tracking macros, calories and meals.',
    icon: Apple,
    steps: [
      'Scan barcodes for instant logging',
      'Adjust your macro ratios in the Nutrition tab',
      'Log your water intake to track hydration levels',
    ],
    longText:
      'Fuel is just as important as the lift. Use our database of over 500k foods to ensure you are hitting your protein and caloric targets every single day.',
  },
  {
    id: 'billing',
    label: 'Billing and Subscription',
    description: 'Manage your premium membership.',
    icon: CreditCard,
    steps: [
      'View your next billing date in Account',
      'Download PDF invoices for your records',
      'Switch between Monthly and Yearly plans',
    ],
    longText:
      'Manage your Pro subscription effortlessly. You can update your payment method or change your billing cycle at any time without losing your data.',
  },
  {
    id: 'account-settings',
    label: 'Account Setting',
    description: 'Privacy, data and preferences.',
    icon: Settings,
    steps: [
      'Enable Two-Factor Authentication (2FA)',
      'Export your workout history as a CSV',
      'Manage your public profile visibility',
    ],
    longText:
      'Your data security is our priority. In settings, you can control who sees your progress and ensure your account is protected with the latest security protocols.',
  },
];

const faqs = [
  {
    question: 'How do I reset my password?',
    answer:
      "You can reset your password by going to Settings > Account > Password, or by clicking 'Forgot Password' on the login page.",
  },
  {
    question: 'How can I change my profile picture?',
    answer:
      'Navigate to Settings > Account and click on your current profile picture to upload a new image.',
  },
  {
    question: 'How do I cancel my Premium subscription?',
    answer:
      "Go to Settings > Privacy > Billing and Subscription. Click 'Manage Subscription' and then 'Cancel Subscription'.",
  },
  {
    question: 'Can I export health data?',
    answer:
      "Yes! Go to Settings > Privacy and click 'Export Data' to download a CSV or JSON file.",
  },
];

const sidebarTabs = [
  { id: 'account', label: 'Account', icon: UserIcon, href: '/settings' },
  {
    id: 'fitness',
    label: 'Fitness Preferences',
    icon: Dumbbell,
    href: '/settings/fitness-preferences',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    href: '/settings/notifications',
  },
  { id: 'privacy', label: 'Privacy', icon: Shield, href: '/settings/privacy' },
  { id: 'display', label: 'Display', icon: Monitor, href: '/settings/display' },
];

export default function SupportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // NEW: Track the green button state
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setContactForm((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
      setLoading(false);
    });
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await signOut();
  };

  // NEW: Handle the animated close
  const handleCloseModal = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setIsSuccess(false); // Reset state for next time
    }, 600); // Small delay to let user see the green "Success" state
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setShowContactForm(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--muted-foreground)]">
        Loading...
      </div>
    );

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm">{displayName}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    Pro Member
                  </div>
                </div>
              </div>
            </div>

            <nav className="space-y-1 mb-6">
              {sidebarTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <tab.icon size={18} /> {tab.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-[var(--border)] pt-4 space-y-1">
              <Link
                href="/support"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-white"
              >
                <HelpCircle size={18} /> Help & Support
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--muted)]"
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {showContactForm ? (
              <form
                onSubmit={handleContactSubmit}
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8"
              >
                <h1 className="text-3xl font-bold mb-6">Get in touch</h1>
                <textarea
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl py-3 px-4 mb-6 outline-none"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-3 border border-[var(--border)] rounded-full text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[var(--color-accent)] rounded-full text-sm font-bold"
                  >
                    Send
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">
                    How can we help you{' '}
                    <span className="text-[var(--color-accent)]">
                      crush your goals?
                    </span>
                  </h1>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Find answers, guides and support for your fitness journey.
                  </p>
                </div>

                <div className="mb-10">
                  <h2 className="text-lg font-bold mb-4">Browse by Category</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category)}
                        className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 text-left hover:border-[var(--color-accent)] transition-all transform active:scale-95"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                            <category.icon size={20} />
                          </div>
                          <Info
                            size={14}
                            className="text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <h3 className="font-bold text-sm mb-1">
                          {category.label}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {category.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-10 pt-6 border-t border-[var(--border)]">
                  <h2 className="text-2xl font-bold mb-6">Popular Questions</h2>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => {
                      const isOpen = openFaq === index;

                      return (
                        <div
                          key={index}
                          className={`bg-[var(--card)] border rounded-2xl transition-all duration-300 ${
                            isOpen
                              ? 'border-[var(--color-accent)] shadow-lg'
                              : 'border-[var(--border)]'
                          }`}
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : index)}
                            className="w-full p-5 flex items-center justify-between text-left group"
                          >
                            <span
                              className={`font-medium text-sm transition-colors ${
                                isOpen
                                  ? 'text-[var(--color-accent)]'
                                  : 'text-[var(--foreground)]'
                              }`}
                            >
                              {faq.question}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-gray-400 transition-transform duration-300 ${
                                isOpen
                                  ? 'rotate-180 text-[var(--color-accent)]'
                                  : 'group-hover:text-white'
                              }`}
                            />
                          </button>

                          {/* ANIMATED WRAPPER */}
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-5 pb-5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                                {faq.answer}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="flex items-center w-fit gap-2 px-5 py-4 bg-[var(--color-accent)] rounded-2xl text-sm font-bold hover:bg-orange-700 active:scale-95 transition-all text-white"
                >
                  <Mail size={16} />
                  Email Support
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedCategory(null)}
          />

          <div className="relative bg-[#0A0A0A] border border-white/10 p-10 rounded-[2.5rem] max-w-lg w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <selectedCategory.icon size={28} />
            </div>

            <h3 className="text-3xl font-bold mb-4">
              {selectedCategory.label}
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">
              {selectedCategory.longText}
            </p>

            <div className="bg-white/5 rounded-3xl p-6 mb-8 border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
                Action Steps
              </h4>
              <div className="space-y-4">
                {selectedCategory.steps.map((step: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-200"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-orange-500 shrink-0 mt-0.5"
                    />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* UPDATED: Animated Button */}
            <button
              onClick={handleCloseModal}
              disabled={isSuccess}
              className={`w-full py-4 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center gap-2
                                ${
                                  isSuccess
                                    ? 'bg-green-600 scale-95'
                                    : 'bg-orange-600 hover:bg-orange-700 active:scale-95'
                                } text-white`}
            >
              {isSuccess ? (
                <CheckCircle2
                  size={20}
                  className="animate-in zoom-in duration-300"
                />
              ) : null}
              <span>{isSuccess ? 'Guide Ready!' : 'Got it, thanks!'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
