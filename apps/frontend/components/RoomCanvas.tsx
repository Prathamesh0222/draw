"use client";

import { Canvas } from "./Canvas";
import { useSocket } from "@/app/hooks/useSocket";

export const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const { socket } = useSocket({ roomId });

  if (!socket) {
    return <div>Connecting to server....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
};
