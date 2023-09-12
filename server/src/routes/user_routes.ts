import express, { Router } from 'express';
import userController from '../controllers/user_controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router: Router = express.Router();
router.get('/', isAuthenticated, userController.getAllUsers);
router.get('/:id', isAuthenticated, userController.getUserById);
router.post('/', isAuthenticated, userController.createNewUser)
router.put('/:id', isAuthenticated, userController.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);
export default router;

