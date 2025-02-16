import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { app } from "..";
import { JWT_SECRET } from "@repo/backend-common/config";

vi.mock("@repo/db/client", () => ({
  prismaClient: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    chat: {
      findMany: vi.fn(),
    },
    room: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

describe("POST /signup", () => {
  it("should create a new user", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    };
    const response = await request(app).post("/signup").send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "User created successfully",
      status: 201,
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(prismaClient.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        username: userData.username,
        password: "hashed-password",
      },
    });
  });

  it("should return 409 if user already exists", async () => {
    (prismaClient.user.findFirst as any).mockResolvedValueOnce({
      email: "test@example.com",
      username: "testuser",
    });

    const response = await request(app).post("/signup").send({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      error: "User already exists",
    });
  });
});

describe("POST /signin", () => {
  const signInData = {
    username: "test123",
    password: "abcd@123",
  };
  it("should sign in the user with right credentials", async () => {
    (prismaClient.user.findFirst as any).mockResolvedValueOnce({
      ...signInData,
      password: "hashed-password",
    });
    const response = await request(app).post("/signin").send(signInData);

    expect(response.statusCode).toBe(200);
    expect(bcrypt.compare).toBeCalledWith(
      signInData.password,
      "hashed-password"
    );
    expect(response.body).toEqual({
      message: "User logged in successfully",
      token: expect.any(String),
    });
  });

  it("should return 403 for non-existent user", async () => {
    (prismaClient.user.findFirst as any).mockResolvedValueOnce(null);

    const response = await request(app).post("/signin").send(signInData);

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: "Unauthorized",
    });
  });

  it("should return 403 for incorrect password", async () => {
    (prismaClient.user.findFirst as any).mockResolvedValueOnce({
      ...signInData,
      password: "hashed-password",
    });
    (bcrypt.compare as any).mockResolvedValueOnce(false);

    const response = await request(app).post("/signin").send(signInData);

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: "Unauthorized",
    });
  });
});

describe("Create Room logic /room", () => {
  const token = jwt.sign({ userId: 1 }, JWT_SECRET);
  it("Create room by giving right payload", async () => {
    (prismaClient.user.findFirst as any).mockResolvedValueOnce({
      id: 1,
      username: "testuser",
    });

    (prismaClient.room.create as any).mockResolvedValueOnce({
      id: 123,
      slug: "test-room",
      adminId: 1,
    });

    const response = await request(app)
      .post("/room")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test-room" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      roomId: 123,
    });
  });
});

describe("GET Chats /chats/:roomId", () => {
  it("should return messages for a valid room", async () => {
    (prismaClient.chat.findMany as any).mockResolvedValueOnce([
      { id: 1, message: "Test-Message", roomId: 1 },
    ]);
    const response = await request(app).get("/chats/1");

    expect(response.status).toBe(200);
    expect(response.body.messages).toHaveLength(1);
  });

  it("should handle invalid roomId format", async () => {
    (prismaClient.chat.findMany as any).mockResolvedValueOnce([]);
    const response = await request(app).get("/chats/abc");

    expect(response.status).toBe(200);
    expect(response.body.messages).toEqual([]);
  });
});

describe("GET /chats", () => {
  const validToken = jwt.sign({ userId: 1 }, JWT_SECRET);

  it("should return list of rooms with admin details", async () => {
    (prismaClient.room.findMany as any).mockResolvedValueOnce([
      {
        id: 1,
        slug: "test-room",
        createdAt: new Date("2025-02-02"),
        admin: { username: "testadmin" },
      },
    ]);

    const response = await request(app)
      .get("/chats")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        slug: "test-room",
        createdAt: "2025-02-02T00:00:00.000Z",
        admin: { username: "testadmin" },
      },
    ]);
  });
});
