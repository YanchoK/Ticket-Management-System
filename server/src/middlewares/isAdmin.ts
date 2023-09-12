import { Request, Response, NextFunction } from "express";
import { User } from "../interfaces/user_interface";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user=req.user as User
    
    if (user.role==="ADMIN") {
        return next();
    }
    res.status(401).json({ message: "Only admin can delete tickets" });
};

export { isAdmin };
