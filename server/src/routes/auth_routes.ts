import express,{ Router } from "express";
import userController from "../controllers/user_controller";

const router:Router=express.Router()
router.post('/signup',userController.signup);

export default router; 