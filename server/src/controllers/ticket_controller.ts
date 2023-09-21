import { Request, Response, NextFunction } from 'express';
import { Ticket } from "../interfaces/ticket_interface"
import ticketService from '../services/ticket_service'
import errorResponces from "../middlewares/errorResponces"
import validator from '../middlewares/validator';
import JiraService from '../services/jira_service';

const TicketController = {

    async getAllTickets(req: Request, res: Response) {
        try {
            const page: number = parseInt(req.query.page as string); // The requested page number
            const limit: number = parseInt(req.query.limit as string); // Number of items per page
            let sortBy: string | undefined = req.query.sortBy as string
            let orderBy: string | undefined = req.query.orderBy as string
       
            const keys = ["shortDescription", "description", "state", "priority", "assignedToId", "createdDate", "updatedDate"]
            if (sortBy && !keys.includes(sortBy)) {
                sortBy = undefined
            }
            if (orderBy !== "asc" && orderBy !== "desc") {
                orderBy = "asc"
            }

            const tickets: Ticket[] = await ticketService.getAllTickets(sortBy, orderBy, page, limit);
            const allTicketsCount: number = await ticketService.getAllTicketsCount()

            res.status(200).send({ allTicketsCount: allTicketsCount, tickets: tickets });
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
                console.log("ticket controller")
                let { shortDescription, description, state } = (value as Ticket)
                const JIRA_ID: string = await JiraService.createIssue(shortDescription, description, state)

                const newTicket: Ticket = { JIRA_ID, ...value }

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
        let ticketValidation = validator.validateTicket(req.body)
        let changedTicket: Ticket = ticketValidation.value

        if (ticketValidation.error) {
            console.log(ticketValidation.error);
            return res.status(400).send({ message: `${errorResponces.invalidTicketData.message}. ${ticketValidation.error.message}` });
        }

        let idValidation = validator.validateId(req.params)
        let { id } = idValidation.value

        // if (idValidation.error) {
        //     console.log(idValidation.error);
        //     return res.status(400).send({ message: idValidation.error.message });
        // }

        try {
            const ticket = await ticketService.getTicketById(id)

            if (!ticket) {
                return res.status(404).json(errorResponces.ticketNotFound);
            }

            const updatedTicket = await ticketService.updateTicket(id, changedTicket)

            let { JIRA_ID, shortDescription, description, state } = (updatedTicket as Ticket)
            if (JIRA_ID) {
                await JiraService.updateIssue(JIRA_ID, shortDescription, description, state)
            }

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
            console.log(ticket)
            if (!ticket) {
                return res.status(404).json(errorResponces.ticketNotFound);
            }

            if (ticket.JIRA_ID) {
                await JiraService.deleteTicket(ticket.JIRA_ID)
            }
            // else {
                await ticketService.deleteTicket(id)
            // }

            res.status(200).json({ message: "Ticket is deleted" });
        } catch (error: any) {
            console.error("Error in deleteTicket:", error.message);
            res.status(500).json(errorResponces.internalServerError);
        }
    }
}

export default TicketController;