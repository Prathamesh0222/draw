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
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createSpace, setCreateSpace] = useState("");
  const session = useSession();
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-md bg-gradient-to-r from-background/80 to-background/60"
    >
      <nav className="max-w-7xl mx-auto p-5">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            {session.data?.user?.image && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Image
                  src={session.data?.user?.image}
                  alt="Profile picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </motion.div>
            )}
          </motion.div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Create Room
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-b from-background to-background/90 backdrop-blur-lg border border-white/10">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Create Room
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Give a name to your room
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Enter room name"
                value={createSpace}
                onChange={(e) => setCreateSpace(e.target.value)}
                className="bg-background/50 border border-white/10 focus:border-primary/50 transition-colors"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={createRoom}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300"
                >
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </motion.div>
  );
};
