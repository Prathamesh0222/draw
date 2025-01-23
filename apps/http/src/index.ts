import express, { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CustomRequest, middleware } from "./middleware";
import { prismaClient } from "@repo/db/client";
import {
  CreateRoomSchema,
  SignupSchema,
  SigninSchema,
} from "@repo/common/types";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const { email, password, username } = parsedData.data;

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

  const hashedPassword = bcrypt.hash(password, 10);

  await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  res.json({
    message: "User created successfully",
    status: 201,
  });
});

app.post("/signin", async (req, res) => {
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
      password,
    },
  });

  const comparePassword = bcrypt.compare(password, user.password);

  if (!comparePassword) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  if (!user) {
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

  res.json({
    token,
  });
});

//@ts-ignore
app.post("/room", middleware, async (req: CustomRequest, res: Response) => {
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

    res.json({
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

app.listen(3001);
