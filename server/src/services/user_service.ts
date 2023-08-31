import { User } from "../interfaces/user_interface"
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
import errorResponces from "../middlewares/errorResponces"
const prisma = new PrismaClient();

const UserService = {

    async getAllUsers(): Promise<User[]> {
        try {
            return await prisma.user.findMany() as User[]
        } catch (error) {
            console.error("Error in getAllUsersInRange:", error);
            throw new Error("Error while getting users");
        }
    },

    async getAllUsersInRange(page: number, limit: number) {
        try {
            const allUsersInRange = await prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allUsersInRange.length === 0) {
                const usersCount = await prisma.user.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${usersCount}.` };
            }

            return allUsersInRange as User[];
        } catch (error) {
            console.error("Error in getAllUsersInRange:", error);
            throw new Error("Error while getting users");
        }
    },

    async getUserById(userId: number) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                }
            });

            return user as User;
        } catch (error: any) {
            console.error("Error in getUserById:", error);
            throw new Error("Error while getting user by ID");
        }
    },

    async getUserByEmail(userEmail: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: userEmail
                }
            });

            return user as User;
        } catch (error: any) {
            console.error("Error in getUserByEmail:", error);
            throw new Error("Error while getting user by email");
        }
    },

    async createNewUser(newUser: User) {
        // const { firstName, lastName,fullName, email, passwordHash, role } = newUser;

        try {
            let { passwordHash, ...userWithoutPassword } = newUser;
            passwordHash = await bcrypt.hash(passwordHash, 10);


            const createdUser = await prisma.user.create({
                data: { ...userWithoutPassword, passwordHash: passwordHash }
            })

            delete (createdUser as any).passwordHash;
            return createdUser;
        }
        catch (error: any) {
            console.error("Error in createNewUser:", error);
            throw new Error("Error while creating a new user");
        }
    },

    async updateUser(userId: number, changedUser: User) {
        try {
            const updatedUser = await prisma.user.update({
                where: {
                  id:userId
                },
                data: {
                    ...changedUser
                },
            });

            return updatedUser;
        } catch (error: any) {
            console.error("Error in updateUser:", error);
            throw new Error(errorResponces.updateUserError.message);
        }
    },

    async deleteUser(userId: number) {
        try {
            await prisma.user.delete({
                where: {
                    id: userId
                }
            })
        } catch (error: any) {
            console.error("Error in deleteUser:", error);
            throw new Error("Error while deleting user");
        }
    }
}

export default UserService;