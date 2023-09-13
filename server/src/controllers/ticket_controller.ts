import { Request, Response, NextFunction } from 'express';
import { Ticket } from "../interfaces/ticket_interface"
import ticketService from '../services/ticket_service'
import errorResponces from "../middlewares/errorResponces"
import validator from '../middlewares/validator';

const TicketController = {

    async getAllTickets(req: Request, res: Response) {
        try {
            const page: number = parseInt(req.query.page as string); // The requested page number
            const limit: number = parseInt(req.query.limit as string); // Number of items per page
            let sortBy: string | undefined = req.query.sortBy as string

            const keys = ["shortDescription", "description", "state", "priority", "assignedToId", "createdDate,", "updatedDate"]
            if (sortBy && !keys.includes(sortBy)) {
                sortBy = undefined
            }

            const allTickets: Ticket[] = await ticketService.getAllTickets(sortBy, page, limit);

            res.status(200).send({ count: allTickets.length, tickets: allTickets });
        } catch (error) {
            console.error("Error in getAllTickets:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async getTicketById(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const ticket = await ticketService.getTicketById(parseInt(id))

            if (!ticket) {
                return res.status(404).json(errorResponces.ticketNotFound);
            }

            res.status(200).json(ticket);
        } catch (error) {
            console.error("Error in getTicketById:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async createNewTicket(req: Request, res: Response) {
        let { error, value } = validator.validateTicket(req.body)
        const { firstName, lastName, email, password, role } = value;

        if (error) {
            // res.status(400).json(errorResponces.invalidTicketData);
            console.log(error);
            return res.status(400).send({ message: `${errorResponces.invalidTicketData.message}. ${error.message}` });
        }
        // else if (await ticketService.getTicketByEmail(email)) {
        //     return res.status(409).json(errorResponces.ticketAlreadyExists);
        // }
        else {
            try {
                const newTicket: Ticket = value
                const createdTicket = await ticketService.createNewTicket(newTicket)
                res.status(201).json({ message: "Ticket is created", data: createdTicket });
            }
            catch (error: any) {
                console.error("Error in createNewTicket:", error);
                res.status(500).json(errorResponces.internalServerError);
            }
        }
    },

    async updateTicket(req: Request, res: Response) {
        let validation = validator.validateTicket(req.body)
        let changedTicket: Ticket = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: `${errorResponces.invalidTicketData.message}. ${validation.error.message}` });
        }

        validation = validator.validateId(req.params)
        let { id } = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: validation.error.message });
        }

        try {
            const ticket = await ticketService.getTicketById(id)

            if (!ticket) {
                return res.status(404).json(errorResponces.ticketNotFound);
            }

            const updatedTicket = await ticketService.updateTicket(id, changedTicket)
            res.status(200).json({ message: "Ticket is updated", data: updatedTicket });
        } catch (error: any) {
            console.error("Error in updateTicket:", error);
            res.status(500).json(error.message ? error.message : errorResponces.internalServerError);
        }
    },

    async deleteTicket(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const ticket = await ticketService.getTicketById(id)

            if (!ticket) {
                return res.status(404).json(errorResponces.ticketNotFound);
            }

            await ticketService.deleteTicket(id)
            res.status(200).json({ message: "Ticket is deleted" });
        } catch (error: any) {
            console.error("Error in deleteTicket:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    }
}

export default TicketController;