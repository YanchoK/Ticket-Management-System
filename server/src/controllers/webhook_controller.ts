import { Request, Response } from 'express';
import TicketService from '../services/ticket_service';
import { Ticket, TicketPriority, TicketState } from '../interfaces/ticket_interface';

const WebhookController = {

    async onIssueCreate(req: Request, res: Response) {
        const stateIdToStatus: any = {
            "10032": "NEW",
            "3": "IN_PROGRESS",
            "10013": "REVIEW",
            "10023": "DONE",
        }

        try {
            const body: any = req.body

            if (body && !body.check) {
                const key = body.issue.key
                let ticket: Ticket = await TicketService.getTicketByJiraID(key)

                if (!ticket) {
                    const { summary, description, status } = body.issue.fields
                    let ticket: Ticket = {
                        shortDescription: summary,
                        description: description,
                        state: stateIdToStatus[status.id.toString()],
                        priority:TicketPriority.MODERATE,
                        JIRA_ID:key
                    }
                 
                    let updated = await TicketService.createNewTicket(ticket)
                    console.log(updated)
                }

                // console.log(body.issue)
                // console.log(summary)
                // console.log(description)
                // console.log(status.name)
                // console.log(status)
            }

            res.json({ message: "OK" });
        } catch (error: any) {
            res.send(error.message)
        }
    },

    async onIssueUpdate(req: Request, res: Response) {
        const stateIdToStatus: any = {
            "10032": "NEW",
            "3": "IN_PROGRESS",
            "10013": "REVIEW",
            "10023": "DONE",
        }

        try {
            const body: any = req.body

            if (body && !body.check) {
                const key = body.issue.key
                const { summary, description, status } = body.issue.fields

                let ticket: Ticket = await TicketService.getTicketByJiraID(key)

                ticket.shortDescription = summary
                ticket.description = description
                ticket.state = stateIdToStatus[status.id.toString()]

                if (ticket.id) {
                    let updated = await TicketService.updateTicket(ticket.id, ticket)
                    console.log(updated)
                }

                // console.log(summary)
                // console.log(description)
                // console.log(status.name)
                console.log(status)
            }

            res.json({ message: "OK" });
        } catch (error: any) {
            res.send(error.message)
        }
    },

    async onIssueDelete(req: Request, res: Response) {
        try {
            const body: any = req.body

            if (body && !body.check) {
                const key = body.issue.key
                let ticket: Ticket = await TicketService.getTicketByJiraID(key)

                if (ticket.id) {
                    await TicketService.deleteTicket(ticket.id)
                }
            }

            res.json({ message: "OK" });
        } catch (error: any) {
            res.send(error.message)
        }
    },






}

export default WebhookController