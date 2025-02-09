import { WS_URL } from "@/config";
import { useEffect, useState } from "react";

export const useSocket = ({ roomId }: { roomId: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    ws.onerror = (error) => {
      console.error("Websocket error", error);
    };

    ws.onclose = () => {
      setSocket(null);
    };
  }, [roomId]);

  return { socket };
};
