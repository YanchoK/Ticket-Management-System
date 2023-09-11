// import { Request, Response, NextFunction } from "express";
// import passport from "passport";
// import { User } from "../interfaces/user_interface"
// import errorResponces from "../middlewares/errorResponces";

// const AuthService = {
//     login: async (req: Request, res: Response, user: User) => {
//         req.login(user, (err) => {
//             if (err) {
//                 console.error("Error during automatic login:", err);
//                 return res.status(500).json(errorResponces.internalServerError);
//             }
//             // Return a success response
//             res.status(201).json({ message: "User is created and logged in", data: user });
//         });
//     }
// }


// export default AuthService