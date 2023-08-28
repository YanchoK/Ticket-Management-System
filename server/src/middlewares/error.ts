import { Response } from 'express';


const error = {
    internalServerError: {
        message: "Internal server error",
    },
    userNotFound: {
        message: "User not found",
    },
    invalidUserData: {
        message: "Invalid user data",
    },
    createUserError: {
        message: "Error while creating a new user",
    },
    updateUserError: {
        message: "Error while updating user",
    },
    deleteUserError: {
        message: "Error while deleting user",
    },
    fetchUsersError: {
        message: "Error while fetching users",
    },
    fetchUserByIdError: {
        message: "Error while fetching user by ID",
    },
    userAlreadyExists: {
        message: "User with this email already exists"
    }
}

export default error;