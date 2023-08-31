import { Response } from 'express';


const errorResponces = {
    internalServerError: {
        message: "Internal server error",
    },
    userNotFound: {
        message: "User not found",
    },
    ticketNotFound: {
        message: "Ticket not found",
    },
    invalidUserData: {
        message: "Invalid user data",
    },
    invalidTicketData: {
        message: "Invalid ticket data",
    },
    createTicketError: {
        message: "Error while creating a new ticket",
    },
    updateUserError: {
        message: "Error while updating user",
    },
    updateTicketError: {
        message: "Error while updating ticket",
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

export default errorResponces;