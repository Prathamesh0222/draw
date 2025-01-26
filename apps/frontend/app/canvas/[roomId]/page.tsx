"use client";

import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      let userClicked = false;
      let startX = 0;
      let startY = 0;

      canvas.addEventListener("mousedown", (e) => {
        userClicked = true;
        startX = e.clientX;
        startY = e.clientY;
      });

      canvas.addEventListener("mouseup", (e) => {
        userClicked = false;
        console.log(e.clientX);
        console.log(e.clientY);
      });

      canvas.addEventListener("mousemove", (e) => {
        if (userClicked) {
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          if (ctx) {
            ctx.strokeStyle = "rgba(255,255,255)";
          }
          ctx?.strokeRect(startX, startY, width, height);
        }
      });
    }
  }, [canvasRef]);

  return (
    <div className=" h-screen overflow-hidden">
      <canvas ref={canvasRef} width={1920} height={1080}></canvas>
    </div>
  );
}
