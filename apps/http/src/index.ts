import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { prismaClient } from "@repo/db/client";
import {
  CreateRoomSchema,
  SignupSchema,
  SigninSchema,
} from "@repo/common/types";

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
    res.json({
      error: "User already exists",
      status: 409,
    });
  }

  await prismaClient.user.create({
    data: {
      email,
      password,
      username,
    },
  });

  res.json({
    message: "User created successfully",
    status: 201,
  });
});

app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  // db call

  res.json({
    roomId: 123,
  });
});

app.listen(3001);
