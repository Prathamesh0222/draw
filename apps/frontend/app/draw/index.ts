import { HTTP_URL } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: "number";
      centerY: "number";
      radius: "number";
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);
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
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId,
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (userClicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      if (ctx) {
        ctx.strokeStyle = "rgba(255,255,255)";
      }
      ctx?.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      if (ctx) {
        ctx.strokeStyle = "rgba(255,255,255)";
      }
      ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_URL}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
