import express, { Router } from 'express';
import userController from '../controllers/user_controller.js';

const router: Router = express.Router();
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createNewUser)
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
export default router;

