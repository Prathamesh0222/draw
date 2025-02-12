"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRoom } from "../hooks/useRoom";
import { Navbar } from "@/components/Navbar";
import LoadingSkeleton from "./loading";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const { existingRooms, rooms, isLoading } = useRoom();

  useEffect(() => {
    existingRooms();
  }, []);

  const skeletonCount = 3;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-b from-background to-background/80 min-h-screen">
      <Navbar />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-6 justify-center mt-12"
      >
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          : rooms.map((room, idx) => (
              <motion.div
                key={idx}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-lg shadow-xl hover:border-primary/30 transition-colors duration-300"
              >
                <div className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {room.slug}
                </div>
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  Created by {room.admin.username}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(room.createdAt).toLocaleDateString()}
                </div>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
                    onClick={() => {
                      router.push(`/canvas/${room.id}`);
                    }}
                  >
                    Join Room
                  </Button>
                </motion.div>
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
}
