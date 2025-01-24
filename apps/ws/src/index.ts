import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

class UserManager {
  private static instance: UserManager;
  private users: User[] = [];

  private constructor() {}

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public addUser(user: User) {
    this.users.push(user);
  }

  public removeUser(ws: WebSocket) {
    this.users = this.users.filter((user) => user.ws !== ws);
  }

  public getUsersByWebsocket(ws: WebSocket) {
    return this.users.find((user) => user.ws === ws);
  }

  public getUsersByRoom(roomId: string) {
    return this.users.filter((user) => user.rooms.includes(roomId));
  }

  public addRoomToUser(ws: WebSocket, roomId: string) {
    const user = this.getUsersByWebsocket(ws);
    if (user) {
      user.rooms.push(roomId);
    }
  }

  public removeRoomFromUser(ws: WebSocket, roomId: string) {
    const user = this.getUsersByWebsocket(ws);
    if (user) {
      user.rooms = user.rooms.filter((x) => x !== roomId);
    }
  }
}

const userManager = UserManager.getInstance();

const checkUser = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
};

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  userManager.addUser({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    try {
      if (parsedData.type === "join_room") {
        userManager.addRoomToUser(ws, parsedData.roomId);
      }
    } catch (error) {
      console.error(error);
    }

    if (parsedData.type === "leave_room") {
      userManager.removeRoomFromUser(ws, parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      const users = userManager.getUsersByRoom(roomId);
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
  ws.on("close", () => {
    userManager.removeUser(ws);
  });
});
