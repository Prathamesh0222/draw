import { useEffect, useRef, useState } from "react";
import { Toolbar } from "./Toolbar";
import { Game } from "@/app/draw/Game";

export enum SelectType {
  circle = "circle",
  rectangle = "rect",
  pencil = "pencil",
  text = "text",
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
  const [color, setColor] = useState("#FFFFFF");
  const [selectedTool, setSelectedTool] = useState<SelectType>(
    SelectType.circle
  );

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (game) {
      game.setColor(color);
    }
  }, [color, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket, color);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  return (
    <div className="relative h-screen overflow-hidden">
      <Toolbar
        color={color}
        setColor={setColor}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerWidth}
        className="bg-neutral-900"
      ></canvas>
    </div>
  );
};
