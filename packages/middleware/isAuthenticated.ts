import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.access_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthoized ! token missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };
    if (!decoded) {
      res.status(401).json({
        message: "Unauthorized ! Invalid token",
      });
    }
    const account = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = account;

    if (!account) {
      res.status(401).json({
        message: "Account not found !",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticated;
