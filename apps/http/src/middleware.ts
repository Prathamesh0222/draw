import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export interface CustomRequest extends Request {
  userId: string;
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers["authorization"] ?? "";

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "No token provided",
    });
  }

  const token = authHeaders.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "No token provided",
    });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (decoded) {
    (req as CustomRequest).userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};
