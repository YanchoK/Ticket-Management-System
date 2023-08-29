import express,{ Router } from "express";
import userController from "../controllers/user_controller";
import tryCatch from "../utils/tryCatch";

const router:Router=express.Router()
router.post('/test1',tryCatch(userController.test1));
router.get('/test2',tryCatch(userController.test2));
router.get('/test3',tryCatch(userController.test3));

export default router; 