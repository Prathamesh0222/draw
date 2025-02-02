import { SelectType } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: SelectType.rectangle;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: SelectType.circle;
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: SelectType.pencil;
      points: Array<{ x: number; y: number }>;
      color: string;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  socket: WebSocket;
  private startX = 0;
  private startY = 0;
  private selectedTool: SelectType = SelectType.circle;
  private userClicked: boolean;
  private currentPath: Array<{ x: number; y: number }> = [];

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.userClicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(shape: SelectType) {
    this.selectedTool = shape;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.existingShapes.map((shape) => {
      if (shape.type === SelectType.rectangle) {
        if (this.ctx) {
          this.ctx.strokeStyle = "rgba(255,255,255)";
        }
        this.ctx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === SelectType.circle) {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else {
        if (shape.points.length < 2) return;
        this.ctx.beginPath();
        this.ctx.strokeStyle = shape.color;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  mouseDownHandler = (e: MouseEvent): void => {
    this.userClicked = true;
    if (this.selectedTool === SelectType.pencil) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.currentPath = [{ x, y }];
    } else {
      this.startX = e.clientX;
      this.startY = e.clientY;
    }
  };

  mouseUpHandler = (e: MouseEvent): void => {
    this.userClicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool === SelectType.rectangle) {
      shape = {
        type: SelectType.rectangle,
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (selectedTool === SelectType.circle) {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: SelectType.circle,
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
      };
    } else if (selectedTool === SelectType.pencil) {
      if (this.currentPath.length > 0) {
        shape = {
          type: SelectType.pencil,
          points: this.currentPath,
          color: "rgba(255,255,255)",
        };
      }
    }

    if (!shape) {
      return;
    }

    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      })
    );
  };

  mouseMoveHandler = (e: MouseEvent): void => {
    if (!this.userClicked) return;
    if (this.selectedTool === SelectType.pencil) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.currentPath.push({ x, y });

      this.ctx.beginPath();
      this.ctx.strokeStyle = "rgba(255,255,255)";
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";

      const lastPoint =
        this.currentPath[this.currentPath.length - 2] || this.currentPath[0];
      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.closePath();
    } else {
      if (this.userClicked) {
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        this.clearCanvas();
        if (this.ctx) {
          this.ctx.strokeStyle = "rgba(255,255,255)";
        }
        const selectedTool = this.selectedTool;
        if (selectedTool === SelectType.rectangle) {
          this.ctx?.strokeRect(this.startX, this.startY, width, height);
        } else if (selectedTool === SelectType.circle) {
          const radius = Math.max(width, height) / 2;
          const centerX = this.startX + radius;
          const centerY = this.startY + radius;
          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
