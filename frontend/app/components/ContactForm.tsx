"use client";

import { useState } from "react";
import { User, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          /* --- SUCCESS MESSAGE VIEW --- */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-zinc-400 max-w-sm mb-8">
              Thank you for contacting us. We have received your message and will get back to you shortly.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-orange-500 hover:text-orange-400 font-semibold transition-colors flex items-center gap-2"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          /* --- FORM VIEW --- */
          <motion.form
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-white">Your Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/80 group-focus-within:text-orange-500 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-white">Your Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/80 group-focus-within:text-orange-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-3">
              <label className="text-base font-semibold text-white">Subjects</label>
              <input
                required
                type="text"
                placeholder="What is this regarding?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-3">
              <label className="text-base font-semibold text-white">Message</label>
              <textarea
                required
                rows={6}
                placeholder="Type your message here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}

<div className="pt-4 pb-2 px-2"> {/* This wrapper provides the "growth zone" */}
  <motion.button
    type="submit"
    // Use scale with a slight Y offset to keep it centered
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }}
    
    className="bg-orange-600 text-white font-bold py-4 px-8 rounded-xl w-full md:w-auto transform-gpu origin-center"
  >
    Send Message
  </motion.button>
</div>  

          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}