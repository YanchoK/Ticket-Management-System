import express,{ Request, Response, NextFunction } from 'express';
import { User } from "../interfaces/user_interface"
import userService from '../services/user_service'
import errorResponces from "../middlewares/error"
import validator from '../middlewares/validator';


const UserController = {
    async signup(req: Request, res: Response, next: NextFunction) {
        const { error, value } = validator.validateSignup(req.body);

        if (error) {
            console.log(error);
            return res.send(error.details);
        }

        res.status(200).json({
            message: "Successfully signed up!",
            value: value
        });
    },

    async getAllUsers(req: Request, res: Response) {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 5; // Number of items per page

        try {
            let allUsers: User[];
            if (!req.query.page && !req.query.limit) {
                allUsers = await userService.getAllUsers();
            }
            else {
                allUsers = await userService.getAllUsersInRange(page, limit);
            }
            res.status(200).send({ count: allUsers.length, users: allUsers });
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await userService.getUserById(parseInt(id))

            if (!user) {
                return res.status(404).json(errorResponces.userNotFound);
            }

            res.status(200).json(user);
        } catch (error) {
            console.error("Error in getUserById:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async createNewUser(req: Request, res: Response) {
        const { firstName, lastName, email, passwordHash, role } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !passwordHash ||
            !role
        ) {
            res.status(400).json(errorResponces.invalidUserData);
        }
        else if (await userService.getUserByEmail(email)) {
            return res.status(409).json(errorResponces.userAlreadyExists);
        }
        else {

            // let passwordHash: string = password.toString() // use middleware to encript the password
            try {
                const newUser: User = {
                    firstName: firstName,
                    lastName: lastName,
                    fullName: firstName + " " + lastName,
                    email: email,
                    passwordHash: passwordHash,
                    role: role,
                }

                const createdUser = await userService.createNewUser(newUser)
                res.status(201).json({ message: "User is created", data: createdUser });
            }
            catch (error: any) {
                console.error("Error in createNewUser:", error);
                res.status(500).json(errorResponces.internalServerError);
            }
        }
    },

    async updateUser(req: Request, res: Response) {
        const { body, params: { id } } = req;
        try {
            const user = await userService.getUserById(parseInt(id))

            if (!user) {
                return res.status(404).json(errorResponces.userNotFound);
            }

            const updatedUser = await userService.updateUser(parseInt(id), body as User)
            res.status(200).json({ message: "User is updated", data: updatedUser });
        } catch (error: any) {
            console.error("Error in updateUser:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const user = await userService.getUserById(parseInt(id))

            if (!user) {
                return res.status(404).json(errorResponces.userNotFound);
            }

            await userService.deleteUser(parseInt(id))
            res.status(200).json({ message: "User is deleted" });
        } catch (error: any) {
            console.error("Error in deleteUser:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    }
}

export default UserController;