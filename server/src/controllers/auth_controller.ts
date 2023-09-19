
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { User } from "../interfaces/user_interface"
import validator from "../middlewares/validator";
import errorResponces from "../middlewares/errorResponces";

const authController = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        let { error, value } = validator.validateLogIn(req.body)

        if (error) {
            // res.status(400).json(errorResponces.invalidUserData);
            console.log(error);
            return res.status(400).send({ message: `${errorResponces.invalidUserData.message}. ${error.message}` });
        }
        else {
            passport.authenticate("local", (err: any, user: User) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                if (!user) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                // Auto log in the user
                req.login(user, (err) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    const { passwordHash, ...userWithoutPassword } = user;
                    return res.status(200).json(userWithoutPassword);
                });

            })(req, res, next);
        }
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
    checkAuth: (req: Request, res: Response) => {
        res.sendStatus(200);
    },
};

export default authController;
