"use client";

import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current);
    }
  }, [canvasRef]);

  return (
    <div className=" h-screen overflow-hidden">
      <canvas ref={canvasRef} width={1920} height={1080}></canvas>
    </div>
  );
}
