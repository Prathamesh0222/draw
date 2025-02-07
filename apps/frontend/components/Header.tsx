"use client";

import { Github } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const Header = () => {
  const router = useRouter();
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        type: "spring",
        damping: 10,
        stiffness: 100,
      }}
      className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-black/30 text-white"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            DrawTopia
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="w-5 h-5" />
              </Button>
            </a>
            <Button onClick={() => router.push("/signin")}>
              Start Drawing
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
