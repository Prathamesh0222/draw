"use client";

import { Eraser, Pencil, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: <Pencil className="w-8 h-8 text-blue-400" />,
    title: "Free Drawing",
    description:
      "Express yourself with our intuitive drawing tools. Create stunning artwork with precision and ease.",
    gradientFrom: "from-blue-500/20",
    gradientTo: "to-blue-600/20",
  },
  {
    icon: <Users className="w-8 h-8 text-green-400" />,
    title: "Real-time Collaboration",
    description:
      "Work together seamlessly with your team. See changes instantly as they happen.",
    gradientFrom: "from-green-500/20",
    gradientTo: "to-green-600/20",
  },
  {
    icon: <Eraser className="w-8 h-8 text-purple-400" />,
    title: "Easy Editing",
    description:
      "Modify your drawings with simple tools. Undo, redo, and perfect your work effortlessly.",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-purple-600/20",
  },
];

export const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef, { once: true });

  return (
    <section className="py-32 text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent"></div>
      <motion.div
        ref={featuresRef}
        initial={{ y: -50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{
          duration: 0.9,
          delay: 0.5,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 via-white to-red-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Everything you need to create amazing drawings and collaborate
            seamlessly with your team
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, translateY: -10 }}
              className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl transition-all duration-300 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/20"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-2xl flex items-center justify-center mb-8 shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
