import { SelectType } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: SelectType.rectangle;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
    }
  | {
      type: SelectType.circle;
      centerX: number;
      centerY: number;
      radius: number;
      color: string;
    }
  | {
      type: SelectType.pencil;
      points: Array<{ x: number; y: number }>;
      color: string;
    }
  | {
      type: SelectType.text;
      x: number;
      y: number;
      text: string;
      fontSize: number;
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
  private textArea: HTMLTextAreaElement | null = null;
  private color: string;

  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    initialColor: string
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.userClicked = false;
    this.color = initialColor;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setColor(color: string) {
    this.color = color;
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.removeTextArea();
  }

  private createTextArea(x: number, y: number) {
    this.removeTextArea();

    const textArea = document.createElement("textarea");
    textArea.style.position = "absolute";
    textArea.style.left = `${x}px`;
    textArea.style.top = `${y}px`;
    textArea.style.backgroundColor = "transparent";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.padding = "0";
    textArea.style.margin = "0";
    textArea.style.overflow = "hidden";
    textArea.style.resize = "none";
    textArea.style.fontSize = "25px";
    textArea.style.fontFamily = "Arial";
    textArea.style.color = this.color;
    textArea.style.minWidth = "100px";
    textArea.style.minHeight = "1em";

    textArea.addEventListener("blur", () => this.handleTextSubmit(textArea));
    textArea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        textArea.blur();
      }
      if (e.key === "Escape") {
        this.removeTextArea();
      }
    });

    const canvasContainer = this.canvas.parentElement;
    if (canvasContainer) {
      canvasContainer.style.position = "relative";
      canvasContainer.appendChild(textArea);
      this.textArea = textArea;
      textArea.focus();
    }
  }

  private removeTextArea() {
    if (this.textArea && this.textArea.parentElement) {
      this.textArea.parentElement.removeChild(this.textArea);
      this.textArea = null;
    }
  }

  private handleTextSubmit(textArea: HTMLTextAreaElement) {
    const text = textArea.value.trim();
    if (text) {
      const rect = this.canvas.getBoundingClientRect();
      const x = parseFloat(textArea.style.left) - rect.left;
      const y = parseFloat(textArea.style.top) - rect.top;
      const shape: Shape = {
        type: SelectType.text,
        x,
        y,
        text,
        fontSize: 25,
        color: this.color,
      };

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
    }
    this.removeTextArea();
    this.clearCanvas();
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
    this.existingShapes.forEach((shape) => {
      this.ctx.strokeStyle = shape.color;
      this.ctx.fillStyle = shape.color;
      this.ctx.lineWidth = 2;
      if (shape.type === SelectType.rectangle) {
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
      } else if (shape.type === SelectType.pencil) {
        if (shape.points.length < 2) return;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === SelectType.text) {
        this.ctx.font = `${shape.fontSize}px Arial`;
        this.ctx.textBaseline = "top";
        this.ctx.fillText(shape.text, shape.x, shape.y);
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
        color: this.color,
      };
    } else if (selectedTool === SelectType.circle) {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: SelectType.circle,
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
        color: this.color,
      };
    } else if (selectedTool === SelectType.pencil) {
      if (this.currentPath.length > 0) {
        shape = {
          type: SelectType.pencil,
          points: this.currentPath,
          color: this.color,
        };
      }
    } else if (selectedTool === SelectType.text) {
      this.canvas.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      this.createTextArea(x, y);
      return;
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
      this.ctx.strokeStyle = this.color;
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
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 2;
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
