"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user_routes"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const initializePassport_1 = __importDefault(require("./middlewares/initializePassport"));
const ticket_routes_1 = __importDefault(require("./routes/ticket_routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api", (req, res) => {
    try {
        res.json({ message: "Hello World!" });
    }
    catch (error) {
        res.send(error.message);
    }
});
app.get('/api/a', async function (req, res) {
    var axios = require('axios');
    const username = process.env.ATLASSIAN_USERNAME;
    const password = process.env.ATLASSIAN_API_KEY;
    const domain = process.env.DOMAIN;
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
        const response = await axios.get(`${baseUrl}` + `/rest/api/2/events/`, config);
        console.log(response);
        res.json(response.data);
    }
    catch (error) {
        console.log('error: ');
        console.log(error.response.data.errors);
    }
});
(0, initializePassport_1.default)(app);
app.use('/api/users', user_routes_1.default);
app.use('/api/tickets', ticket_routes_1.default);
app.use('/api/', auth_routes_1.default);
app.use(errorHandler_1.default);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listenning on http://localhost:${PORT}/`);
});
//# sourceMappingURL=server.js.map