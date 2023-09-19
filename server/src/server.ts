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
import user_routes from './routes/user_routes';
import auth_routes from './routes/auth_routes';
import errorHandler from './middlewares/errorHandler';
import initializePassport from './middlewares/initializePassport';
import ticket_routes from './routes/ticket_routes';

const app = express();
app.use(cors());
app.use(express.json())

app.get("/api", (req: Request, res: Response): void => {
    try {
        res.json({ message: "Hello World!" })
    } catch (error: any) {
        res.send(error.message)
    }
})

app.get('/api/a', async function (req, res) {
    var axios = require('axios');


    const username = process.env.ATLASSIAN_USERNAME
    const password = process.env.ATLASSIAN_API_KEY
    const domain = process.env.DOMAIN

    const auth = {
        username: username,
        password: password
    };

    try {
        const baseUrl = 'https://' + domain + '.atlassian.net';

        const config = {
            headers: { 'Accept': 'application/json' },
            auth: auth
        };

        const response = await axios.get(`${baseUrl}` + `/rest/api/2/events/` , config);

        console.log(response)
        res.json(response.data);
    } catch (error: any) {
        console.log('error: ')
        console.log(error.response.data.errors)
    }

});



initializePassport(app);

// Routes
app.use('/api/users', user_routes);
app.use('/api/tickets', ticket_routes);
app.use('/api/', auth_routes);

app.use(errorHandler);



// app.get(
//   "/test",
//   tryCatch(async (req:Request, res:Response) => {
//     const user = getUser();
//     if (!user) {
//       throw new Error("User not found");
//     }

//     return res.status(200).json({ success: true });
//   })
// );

const PORT: Number = 3000
app.listen(PORT, () => {
    console.log(`Server is listenning on http://localhost:${PORT}/`)
})















