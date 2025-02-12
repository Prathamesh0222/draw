"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: true });

  return (
    <motion.footer
      ref={footerRef}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        type: "spring",
        damping: 15,
        stiffness: 100,
      }}
      className="border-t border-white/10 py-12 mt-20 text-white"
    >
      <div className=" text-center text-gray-400">
        <p>&copy; 2025 DrawTopia. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};
