"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HTTP_URL } from "@/config";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createSpace, setCreateSpace] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const existingRooms = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${HTTP_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error while fetching rooms", error);
    }
  };

  const createRoom = async () => {
    if (!createSpace.trim()) return;
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${HTTP_URL}/room`,
        {
          name: createSpace,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDialogOpen(false);
      setCreateSpace("");
      existingRooms();
    } catch (error) {
      console.error("Error creating room", error);
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
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus /> Create Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Room</DialogTitle>
                <DialogDescription>Give a name to your room</DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Enter room name"
                value={createSpace}
                onChange={(e) => setCreateSpace(e.target.value)}
              />
              <Button onClick={createRoom}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <div className="flex gap-4 justify-center mt-8">
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
