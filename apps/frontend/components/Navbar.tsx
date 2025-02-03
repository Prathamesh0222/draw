"use client";

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
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRoom } from "@/app/hooks/useRoom";

export const Navbar = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createSpace, setCreateSpace] = useState("");
  const { existingRooms } = useRoom();
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

  return (
    <div>
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
    </div>
  );
};
