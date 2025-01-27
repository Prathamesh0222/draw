import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);
  return (
    <div className="h-screen overflow-hidden">
      <canvas ref={canvasRef} width={1920} height={1080}></canvas>
    </div>
  );
};
