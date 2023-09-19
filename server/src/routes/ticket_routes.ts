import express, { Router } from 'express';
import ticketController from '../controllers/ticket_controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router: Router = express.Router();
router.get('/', isAuthenticated, ticketController.getAllTickets);
router.get('/:id', isAuthenticated, ticketController.getTicketById);
router.post('/', isAuthenticated, ticketController.createNewTicket)
router.put('/:id', isAuthenticated, ticketController.updateTicket);
router.delete('/:id', isAuthenticated, isAdmin, ticketController.deleteTicket);
export default router;  
