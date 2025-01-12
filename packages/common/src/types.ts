import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().max(20),
  email: z.string().email(),
  password: z.string().min(8, "Password should be 8 characters"),
});

export const SigninSchema = z.object({
  username: z.string().max(20),
  password: z.string().min(8, "Password should be 8 characters"),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});
