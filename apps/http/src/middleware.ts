import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export interface CustomRequest extends Request {
  userId: string;
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers["authorization"] ?? "";

  if (!authHeaders) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const decoded = jwt.verify(authHeaders, JWT_SECRET) as JwtPayload;

  if (decoded) {
    (req as CustomRequest).userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};
