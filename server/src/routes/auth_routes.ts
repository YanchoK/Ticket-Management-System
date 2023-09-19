import express,{ Router } from "express";
import userController from "../controllers/user_controller";
import tryCatch from "../utils/tryCatch";
import authController from "../controllers/auth_controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router:Router=express.Router()
router.post("/register", userController.createNewUser);
router.post("/login", authController.login);
router.post("/logout", isAuthenticated, authController.logout);
router.get("/me", isAuthenticated, authController.getCurrentUser);
router.get("/checkAuth", isAuthenticated, authController.checkAuth);


router.post('/test1',tryCatch(userController.test1));
router.get('/test2',tryCatch(userController.test2));
router.get('/test3',tryCatch(userController.test3));

export default router; 