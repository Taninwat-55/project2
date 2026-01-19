"use client";

import { useState } from 'react';
import { Check, Zap, Star, ArrowRight, Info, X, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PricingPage({ user }: { user?: any }) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [blueprintSent, setBlueprintSent] = useState(false);

  // Helper to determine user status
  const isLoggedIn = !!user;
  const isPro = user?.user_metadata?.plan === 'pro';

  const handleBlueprintClick = () => {
    setBlueprintSent(true);
    setTimeout(() => setBlueprintSent(false), 5000);
  };

  return (
    <>
    <SiteHeader />
    <div className="min-h-screen bg-black text-white py-20 px-6 relative">
      
      {/* Friendly Information Popup (Modal) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            onClick={() => setShowInfoModal(false)} 
          />
          <div className="bg-[#161616] border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowInfoModal(false)} 
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-14 h-14 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <Zap size={28} fill="currentColor" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">The Pro Edge</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Standard accounts are great for starting, but **Pro** is where the transformation happens. 
              You&apos;ll unlock permanent archives, AI-driven recovery scores, and the ability to export data to your coach.
            </p>
            
            <ul className="space-y-3 mb-8">
              {['Unlimited cloud storage', 'Custom routine builder', 'No ads, ever'].map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-orange-500" /> {feat}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setShowInfoModal(false)}
              className="w-full py-4 bg-orange-600 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
            >
              Ready to Upgrade
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Choose Your Level of Mastery
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Whether you&apos;re just starting or looking to optimize every rep, we have a plan for your journey.
          </p>
        </div>

        {/* Lead Magnet Section */}
        <div className="bg-orange-600/10 border border-orange-600/20 rounded-3xl p-8 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-orange-600/15">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Star size={18} fill="currentColor" />
              <span className="text-sm font-bold uppercase tracking-widest">Free Gift</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro Performance Blueprint</h3>
            <p className="text-gray-400">
              Not ready to commit? Download our 30-day &quot;Elite Density&quot; training guide for free.
            </p>
          </div>
          <button 
            onClick={handleBlueprintClick}
            disabled={blueprintSent}
            className={`px-8 py-4 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              blueprintSent ? 'bg-green-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {blueprintSent ? (
              <><Check size={20} /> Sent to Email</>
            ) : (
              <><Mail size={20} /> Send Me the Blueprint</>
            )}
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Free Plan */}
          <div className="flex flex-col bg-[#111] border border-white/5 p-10 rounded-3xl hover:border-white/10 transition-all group">
            <h3 className="text-xl font-bold mb-2 text-white">Standard</h3>
            <div className="text-4xl font-bold mb-6 text-white">
              $0 <span className="text-sm text-gray-500 font-normal">/ forever</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-gray-400">
                <Check size={18} className="text-orange-600" /> Basic Workout Logging
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Check size={18} className="text-orange-600" /> 7-Day History
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Check size={18} className="text-orange-600" /> Standard Analytics
              </li>
            </ul>

            <Link
              href={isLoggedIn ? "/workouts" : "/signup"}
              className="mt-auto block text-center w-full py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all text-white group-hover:border-white/20"
            >
              {isLoggedIn ? "Current Plan" : "Get Started Free"}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col bg-[#111] border-2 border-orange-600 p-10 rounded-3xl shadow-[0_0_40px_-10px_rgba(234,88,12,0.3)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
              Most Popular
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                Pro <Zap size={18} fill="currentColor" className="text-orange-500" />
              </h3>
              <button 
                onClick={() => setShowInfoModal(true)}
                className="p-1 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
              >
                <Info size={20} />
              </button>
            </div>

            <div className="text-4xl font-bold mb-6 text-white">
              $9.99 <span className="text-sm text-gray-500 font-normal">/ month</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-white">
                <Check size={18} className="text-orange-600" /> Unlimited Workout Archive
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check size={18} className="text-orange-600" /> Advanced Muscle Recovery AI
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check size={18} className="text-orange-600" /> Custom Workout Templates
              </li>
              <li className="flex items-center gap-3 text-white">
                <Check size={18} className="text-orange-600" /> Priority Support
              </li>
            </ul>

            {/* DYNAMIC PRO BUTTON */}
            {!isLoggedIn ? (
              <Link
                href="/signup?plan=pro"
                className="mt-auto w-full py-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
              >
                Sign Up to Go Pro <ArrowRight size={18} />
              </Link>
            ) : isPro ? (
              <button className="mt-auto w-full py-4 rounded-xl border border-orange-600/30 text-orange-500 font-bold cursor-default">
                Active Member
              </button>
            ) : (
              <button className="mt-auto w-full py-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 group">
                Upgrade to Pro <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}