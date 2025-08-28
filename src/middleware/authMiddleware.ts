import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/schema";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.access_token; 
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string) as any;
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).send("Unauthorized, wrong token");
    req.user =  { id: user._id.toString(), email: user.email };
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid or expired token."});
  }
}

export default authMiddleware;