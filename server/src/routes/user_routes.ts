import express, { Router } from 'express';
import userController from '../controllers/user_controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router: Router = express.Router();
router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/:id', isAuthenticated, isAdmin, userController.getUserById);
router.post('/', isAuthenticated, isAdmin, userController.createNewUser)
router.put('/:id', isAuthenticated, isAdmin, userController.updateUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);
export default router;

