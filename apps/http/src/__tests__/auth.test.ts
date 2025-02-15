import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";
import { app } from "..";

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
