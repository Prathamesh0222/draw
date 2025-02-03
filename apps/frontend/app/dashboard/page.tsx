"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Room = {
  admin: {
    username: string;
  };
  slug: string;
  id: string;
  createdAt: string;
};

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  const existingRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error while fetching rooms", error);
    }
  };

  useEffect(() => {
    existingRooms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-background min-h-screen">
      <nav className="p-5">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Drawing Room</h1>
          <Button>
            <Plus /> Create Room
          </Button>
        </div>
      </nav>
      <div className="flex gap-4">
        {rooms.map((room, idx) => (
          <div
            key={idx}
            className="w-[350px] p-5 border rounded-lg hover:scale-105"
          >
            <div className="text-lg">{room.slug}</div>
            <div className="text-sm text-muted-foreground">
              Created by {room.admin.username}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(room.createdAt).toLocaleDateString()}
            </div>
            <Button
              className="w-full"
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
