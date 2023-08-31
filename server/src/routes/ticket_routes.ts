import express, { Router } from 'express';
import ticketController from '../controllers/ticket_controller.js';

const router: Router = express.Router();
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', ticketController.createNewTicket)
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);
export default router;  
