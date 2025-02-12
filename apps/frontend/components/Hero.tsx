"use client";

import {
  ArrowRight,
  Brush,
  Eraser,
  Pen,
  PenTool,
  Pencil,
  Ruler,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute -top-40 -left-40 w-80 h-80 text-red-500/10"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M45,-78.1C58.3,-71.3,69.1,-58.4,77.8,-43.7C86.5,-29,93.2,-12.5,92.6,3.8C92,20.1,84.2,36.2,73.1,48.5C62,60.8,47.6,69.3,32.7,74.3C17.8,79.2,2.3,80.7,-13.4,78.8C-29.1,77,-45,71.8,-57.1,61.8C-69.2,51.8,-77.5,37,-82.6,20.8C-87.7,4.6,-89.6,-13,-85.1,-28.7C-80.6,-44.3,-69.7,-58,-55.6,-65.5C-41.5,-73,-20.7,-74.3,-1.2,-72.5C18.4,-70.7,36.8,-65.9,45,-78.1Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute -bottom-20 -right-20 w-96 h-96 text-red-800/10"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M42.7,-76.2C53.8,-67.3,60.3,-52.4,67.4,-37.8C74.4,-23.2,82,-8.9,81.8,5.2C81.5,19.3,73.5,33.2,64.1,45.2C54.7,57.2,44,67.4,31,73.3C18,79.2,2.7,80.8,-12.3,78.4C-27.4,76,-42.2,69.5,-54.3,59.5C-66.4,49.4,-75.7,35.8,-80.5,20.5C-85.3,5.2,-85.5,-11.8,-79.9,-26.5C-74.3,-41.1,-62.9,-53.4,-49.4,-61.6C-35.9,-69.8,-20.3,-74,-3.6,-68.7C13,-63.5,26,-85.1,42.7,-76.2Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-red-600/5"
          viewBox="0 0 200 200"
        >
          <path
            fill="currentColor"
            d="M39.9,-68.1C53.5,-61.9,67.7,-54.3,75.6,-42.5C83.4,-30.7,85,-14.8,83.1,-0.1C81.2,14.6,75.8,29.2,67.6,41.6C59.3,53.9,48.2,64,35.3,70.7C22.4,77.4,7.7,80.7,-6.9,79.8C-21.6,78.9,-43.2,73.8,-58.3,62.3C-73.4,50.8,-82,32.9,-85.3,14C-88.7,-4.9,-86.8,-24.8,-78.3,-40.8C-69.8,-56.7,-54.7,-68.7,-39.5,-74.1C-24.2,-79.6,-8.9,-78.5,2.6,-73.4C14.2,-68.3,26.3,-74.3,39.9,-68.1Z"
            transform="translate(100 100)"
          />
        </svg>

        <Brush className="absolute top-20 left-20 w-12 h-12 text-red-400/20 transform rotate-12 drop-shadow-lg" />
        <PenTool className="absolute top-40 right-32 w-16 h-16 text-red-500/20 transform -rotate-12 drop-shadow-lg" />
        <Pencil className="absolute bottom-32 left-40 w-14 h-14 text-red-600/20 transform rotate-45 drop-shadow-lg" />
        <Pencil className="absolute bottom-24 right-60 w-14 h-14 text-red-600/20 transform rotate-45 drop-shadow-lg" />
        <Eraser className="absolute top-1/3 right-1/4 w-10 h-10 text-red-300/20 transform -rotate-6 drop-shadow-lg" />
        <Ruler className="absolute bottom-1/4 right-1/3 w-20 h-20 text-red-400/20 transform rotate-[30deg] drop-shadow-lg" />
        <Pen className="absolute top-1/4 left-1/3 w-12 h-12 text-red-500/20 transform -rotate-[15deg] drop-shadow-lg" />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative z-10">
          <div className="space-y-3 text-center">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight"
            >
              Collaborative{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 px-4 rounded-xl shadow-lg">
                Drawing
              </span>
              <br /> Made Simple
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto font-light"
            >
              Create, collaborate, and bring your ideas to life <br />
              with our intuitive drawing platform.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center items-center gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-lg px-8 py-6 rounded-xl shadow-lg transform transition hover:scale-105"
              >
                Try Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
