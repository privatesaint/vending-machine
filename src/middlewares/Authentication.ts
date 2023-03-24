import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWTUSER } from "../types/JwtUser";
import catchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import UserSession from "../models/UserSession";

export const authorize = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const authorizationHeader = String(req.headers.authorization);

    if (!authorizationHeader) {
      throw new ErrorHandler("Authorization token is required.", 401);
    }

    const [, token] = authorizationHeader.split(" ");

    if (!token) {
      throw new ErrorHandler("Authorization token is required.", 401);
    }

    // check if token exist in the session
    const dbToken = await UserSession.findOne({ token });

    if (!dbToken) {
      throw new ErrorHandler("Invalid Token.", 401);
    }

    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err || !decoded) {
        throw new ErrorHandler("Invalid Token", 401);
      }

      req.user = decoded;
      next();
    });
  }
);

export const hasRole =
  (role: "buyer" | "seller") =>
  (req: Request & { user: JWTUSER }, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: "You do not have permission to access this route",
      });
    }

    next();
  };
