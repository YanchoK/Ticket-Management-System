
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import {User} from "../interfaces/user_interface"

const authController = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", (err: any, user: User) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                const { passwordHash, ...userWithoutPassword } = user;
                return res.status(200).json(userWithoutPassword);
            });
        })(req, res, next);
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        req.logout(function (err) {
            if (err) { return next(err); }
        });

        res.status(200).json({ message: "Logged out" });
    },

    getCurrentUser: async (req: Request, res: Response) => {
        const user = req.user as User;
        if (user) {
            const { passwordHash, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    },
};

export default authController;
