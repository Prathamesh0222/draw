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
import cors from "cors";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(passport.initialize());

const callbackURL = process.env.PROD_GOOGLE_URL;
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prismaClient.user.findFirst({
          where: {
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : undefined,
          },
        });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              email:
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : "",
              username: profile.displayName,
              password: "",
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prismaClient.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    if (!user) {
      return res.redirect("/login?error=Unauthorized");
    }

    const token = jwt.sign({ userId: (user as any).id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const PROD_URL = process.env.PROD_URL;

    res.redirect(`${PROD_URL}/dashboard/auth-success?token=${token}`);
  }
);

app.post("/signup", async (req, res) => {
  try {
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

    const hashedPassword = await bcrypt.hash(password, 10);

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
  } catch (error) {
    console.error(error);
    res.json({
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

    res.json({
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

//@ts-ignore
app.get("/chats", middleware, async (req: CustomRequest, res: Response) => {
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
