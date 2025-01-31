import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { ShapeButton } from "./ShapeButtton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { Toolbar } from "./Toolbar";

export enum SelectType {
  circle = "circle",
  rectangle = "rect",
  pencil = "pencil",
}

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<SelectType>(
    SelectType.circle
  );
  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);
  return (
    <div className="h-screen overflow-hidden">
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
};
