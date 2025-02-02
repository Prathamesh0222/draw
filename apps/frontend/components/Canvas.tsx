import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { ShapeButton } from "./ShapeButtton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { Toolbar } from "./Toolbar";
import { Game } from "@/app/draw/Game";

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
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<SelectType>(
    SelectType.circle
  );

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);
  return (
    <div className="relative h-screen overflow-hidden">
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
};
