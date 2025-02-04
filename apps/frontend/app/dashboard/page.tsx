"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useRoom } from "../hooks/useRoom";
import { Navbar } from "@/components/Navbar";
import LoadingSkeleton from "./loading";

export default function Dashboard() {
  const router = useRouter();

  const { existingRooms, rooms, isLoading } = useRoom();

  useEffect(() => {
    existingRooms();
  }, []);

  const skeletonCount = 3;

  return (
    <div className="max-w-7xl mx-auto bg-background min-h-screen">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center mt-8">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          : rooms.map((room, idx) => (
              <div key={idx} className="p-5 border rounded-lg hover:scale-105">
                <div className="text-lg">{room.slug}</div>
                <div className="text-sm text-muted-foreground">
                  Created by {room.admin.username}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(room.createdAt).toLocaleDateString()}
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => {
                    router.push(`/canvas/${room.id}`);
                  }}
                >
                  Join Room
                </Button>
              </div>
            ))}
      </div>
    </div>
  );
}
