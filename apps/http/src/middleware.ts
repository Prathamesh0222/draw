import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers["authorization"] ?? "";

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    res.status(403).json({
      message: "No token provided",
    });
    return;
  }

  const token = authHeaders.split(" ")[1];

  if (!token) {
    res.status(403).json({
      message: "No token provided",
    });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};
