"use client";

import { HTTP_URL } from "@/config";
import axios from "axios";
import { useState } from "react";

type Room = {
  admin: {
    username: string;
  };
  slug: string;
  id: string;
  createdAt: string;
};

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const existingRooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${HTTP_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error while fetching rooms", error);
    }
  };

  return { setRooms, rooms, existingRooms, isLoading };
};
