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


import express from 'express';
// import { PrismaClient } from '@prisma/client';

// npx prisma migrate dev (always stop the server in order to apply in the code)
// npx prisma db push


// use node-cron
const app = express();
const prisma = new PrismaClient()

app.use(express.json())
const port: Number = 3000

// // Register routes
// app.use('/api/v1/users', v1UserRouter);
// app.use('/api/v1/tasks', v1TaskRouter);

app.listen(port, () => { 
    console.log(`Server is listenning on http://localhost:${port}/`)
})















