"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { LANDING_IMG } from "@/config";
import Image from "next/image";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
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
        className="container mx-auto px-4"
      >
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold">
              Collaborative Drawing Made Simple
            </h1>
            <p className="text-xl text-gray-400">
              Create, collaborate, and bring your ideas to life with our
              intuitive drawing platform. Draw together in real-time with
              anyone, anywhere.
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg">
                Try Now <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"></div>
            <Image
              src={LANDING_IMG}
              width={1920}
              height={1080}
              alt="DrawTopia Interface"
              className="rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
