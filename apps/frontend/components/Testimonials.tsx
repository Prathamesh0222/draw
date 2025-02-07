"use client";

import { Star } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const Testimonials = () => {
  const testimonialRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(testimonialRef, { once: true });

  return (
    <section className="py-20 text-white">
      <motion.div
        ref={testimonialRef}
        initial={{ y: -50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{
          duration: 0.9,
          delay: 0.5,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            What Users Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust DrawTopia for their
            creative projects
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "UI/UX Designer",
              company: "Design Co.",
              content:
                "DrawTopia has transformed how our design team collaborates. The real-time features are incredible!",
            },
            {
              name: "Michael Chen",
              role: "Product Manager",
              company: "Tech Solutions",
              content:
                "The intuitive interface and powerful tools make it perfect for quick sketches and detailed designs.",
            },
            {
              name: "Emily Rodriguez",
              role: "Creative Director",
              company: "Creative Studio",
              content:
                "We've cut our design iteration time in half since switching to DrawTopia. It's a game-changer!",
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
            >
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-lg font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
