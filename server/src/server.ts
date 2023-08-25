/*
Client:  
    cd client   
    npm run dev
Server:
    cd server
    npm run build
    npm run dev

    DB prisma:
        npx prisma migrate dev (always stop the server in order to apply in the code)
        npx prisma db push
*/


import express, { Request, Response } from 'express';
import cors from 'cors';
// import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
// app.use(express.json())
// const prisma = new PrismaClient()


app.get("/api", (req: Request, res: Response): void => {
    try {
        res.json({ message: "Hello World!" })
    } catch (error: any) {
        res.send(error.message)
    }
})


// // Register routes
// app.use('/api/v1/users', v1UserRouter);
// app.use('/api/v1/tasks', v1TaskRouter);



const PORT: Number = 3000
app.listen(PORT, () => {
    console.log(`Server is listenning on http://localhost:${PORT}/`)
})















