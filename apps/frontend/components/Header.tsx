"use client";

import { Github } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const Header = () => {
  const router = useRouter();
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 1,
        type: "spring",
        damping: 15,
        stiffness: 80,
      }}
      className="fixed top-0 w-full z-50 border-b border-white/20  backdrop-blur-2xl text-white shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent cursor-pointer"
          >
            DrawTopia
          </motion.h1>
          <div className="flex items-center gap-8">
            <motion.a
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:block hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 ease-in-out pl-3"
              >
                <Github className="w-6 h-6" />
              </Button>
            </motion.a>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => router.push("/signin")}
                className="relative overflow-hidden group bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all duration-300 text-sm md:text-base"
              >
                <motion.span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "-100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative">Start Drawing</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
