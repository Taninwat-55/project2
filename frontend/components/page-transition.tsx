"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}    // Starts slightly lower and invisible
      animate={{ opacity: 1, y: 0 }}     // Slides up to its position and fades in
      exit={{ opacity: 0, y: -15 }}      // Fades out and slides up when leaving
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1]         // Custom "Cubic Bezier" for a premium feel
      }}
    >
      {children}
    </motion.div>
  );
}