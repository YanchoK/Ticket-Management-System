import { Ticket } from "../interfaces/ticket_interface"
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
import errorResponces from "../middlewares/errorResponces"
const prisma = new PrismaClient();

const TicketService = {

    async getAllTickets(): Promise<Ticket[]> {
        try {
            return await prisma.ticket.findMany() as Ticket[]
        } catch (error) {
            console.error("Error in getAllTicketsInRange:", error);
            throw new Error("Error while getting tickets");
        }
    },

    async getAllTicketsInRange(page: number, limit: number) {
        try {
            const allTicketsInRange = await prisma.ticket.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allTicketsInRange.length === 0) {
                const ticketsCount = await prisma.ticket.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${ticketsCount}.` };
            }

            return allTicketsInRange as Ticket[];
        } catch (error) {
            console.error("Error in getAllTicketsInRange:", error);
            throw new Error("Error while getting tickets");
        }
    },

    async getTicketById(ticketId: number) {
        try {
            const ticket = await prisma.ticket.findFirst({
                where: {
                    id: ticketId
                }
            });

            return ticket as Ticket;
        } catch (error: any) {
            console.error("Error in getTicketById:", error);
            throw new Error("Error while getting ticket by ID");
        }
    },

    async createNewTicket(newTicket: Ticket) {
        try {
            const createdTicket = await prisma.ticket.create({
                data: { ...newTicket }
            })

            return createdTicket;
        }
        catch (error: any) {
            console.error("Error in createNewTicket:", error);
            throw new Error("Error while creating a new ticket");
        }
    },

    async updateTicket(ticketId: number, changedTicket: Ticket) {
        try {
            const updatedTicket = await prisma.ticket.update({
                where: {
                    id: ticketId
                },
                data: {
                    ...changedTicket
                },
            });

            return updatedTicket;
        } catch (error: any) {
            console.error("Error in updateTicket:", error);
            throw new Error(errorResponces.updateTicketError.message);
        }
    },

    async deleteTicket(ticketId: number) {
        try {
            await prisma.ticket.delete({
                where: {
                    id: ticketId
                }
            })
        } catch (error: any) {
            console.error("Error in deleteTicket:", error);
            throw new Error("Error while deleting ticket");
        }
    }
}

export default TicketService;