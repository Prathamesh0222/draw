import express, { Request, Response, Express } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middlewares/middleware";
import { prismaClient } from "@repo/db/client";
import {
  CreateRoomSchema,
  SignupSchema,
  SigninSchema,
} from "@repo/common/types";
import bcrypt from "bcryptjs";
import cors from "cors";
import { uploads } from "./middlewares/cloudinary";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.post("/signup", uploads.single("image"), async (req, res) => {
  try {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({
        message: "Incorrect inputs",
      });
      return;
    }

    const { email, password, username } = parsedData.data;
    const imageUrl = req.file?.path;

    const existingUser = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(409).json({
        error: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        avatar: imageUrl || null,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      status: 201,
      image: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user",
      status: 500,
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.json({
        message: "Incorrect inputs",
      });
      return;
    }

    const { username, password } = parsedData.data;

    const user = await prismaClient.user.findFirst({
      where: {
        username,
      },
    });

    if (!user || !user.password) {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error signing in",
      status: 500,
    });
  }
});

app.post("/room", middleware, async (req: Request, res: Response) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.status(200).json({
      roomId: room.id,
    });
  } catch (error) {
    res.json({
      message: "Room already exists",
      status: 409,
    });
    console.error(error);
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  const messages = await prismaClient.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 500,
  });

  res.json({
    messages,
  });
});

app.get("/chats", middleware, async (req: Request, res: Response) => {
  const rooms = await prismaClient.room.findMany({
    select: {
      id: true,
      slug: true,
      createdAt: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
  });
  res.status(200).json(rooms);
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});

app.listen(3001);
