import { Request, Response, NextFunction } from 'express';
import { User } from "../interfaces/user_interface"
import userService from '../services/user_service'
import errorResponces from "../middlewares/errorResponces"
import validator from '../middlewares/validator';
import AppError from '../utils/AppError';
import errorCodes from '../utils/errorCodes';

const UserController = {

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
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

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
        let { error, value } = validator.validateUser(req.body)
        const { firstName, lastName, email, password, role } = value;

        if (error) {
            // res.status(400).json(errorResponces.invalidUserData);
            console.log(error);
            return res.status(400).send({ message: `${errorResponces.invalidUserData.message}. ${error.message}` });
        }
        else if (await userService.getUserByEmail(email)) {
            return res.status(409).json(errorResponces.userAlreadyExists);
        }
        else {
            try {
                const newUser: User = {
                    firstName: firstName,
                    lastName: lastName,
                    fullName: firstName + " " + lastName,
                    email: email,
                    passwordHash: password,
                    role: role,
                }

                const createdUser = await userService.createNewUser(newUser)
                req.login(createdUser, (err) => {
                    if (err) {
                        console.error("Error during automatic login:", err);
                        return res.status(500).json(errorResponces.internalServerError);
                    }
                    // Return a success response
                    res.status(201).json({ message: "User is created and logged in", data: createdUser });
                });
                // res.status(201).json({ message: "User is created", data: createdUser });
            }
            catch (error: any) {
                console.error("Error in createNewUser:", error);
                res.status(500).json(errorResponces.internalServerError);
            }
        }
    },

    async updateUser(req: Request, res: Response) {
        let validation = validator.validateUpdateUser(req.body)
        let changedUser: User = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: `${errorResponces.invalidUserData.message}. ${validation.error.message}` });
        }

        validation = validator.validateId(req.params)
        let {id} = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: validation.error.message });
        }

        try {
            const user = await userService.getUserById(id)

            if (!user) {
                return res.status(404).json(errorResponces.userNotFound);
            }

            const fullName = `${user.firstName} ${user.lastName}`
            changedUser.fullName=fullName
            
            const updatedUser = await userService.updateUser(id, changedUser)
            res.status(200).json({ message: "User is updated", data: updatedUser });
        } catch (error: any) {
            console.error("Error in updateUser:", error);
            res.status(500).json(error.message ? error.message : errorResponces.internalServerError);
        }
    },

    async deleteUser(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const user = await userService.getUserById(id)

            if (!user) {
                return res.status(404).json(errorResponces.userNotFound);
            }

            await userService.deleteUser(id)
            res.status(200).json({ message: "User is deleted" });
        } catch (error: any) {
            console.error("Error in deleteUser:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },




    async test1(req: Request, res: Response, next: NextFunction) {
        const { error, value } = validator.validateLogIn(req.body);

        if (error) throw error;

        // if (error) {
        //     console.log(error);
        //     return res.send(error.details);
        // }

        res.status(200).json({
            message: "Successfully signed up!",
            value: value
        });
    },

    async test2(req: Request, res: Response) {
        // AppError
        const subscription = undefined
        if (!subscription) {
            throw new AppError(errorCodes.INVALID_SUBSCRIPTION, "Subscription not found", 400);
        }
    },

    async test3(req: Request, res: Response, next: NextFunction) {
        // Unpredicted error
        const user = undefined;
        if (!user) {
            throw new Error("User not found");
        }

        return res.status(200).json({ success: true });
    },
}

export default UserController;