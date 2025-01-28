"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZGE0ODA0OS0yNDFlLTRjZWYtOTliYi1kM2JjZWU4MzI0YTciLCJpYXQiOjE3Mzc5NzYzMTJ9.7kvQxbNDz_BUGfqceQ1PhDVRisOGGUVr92CIBk-wFvM`
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
};
