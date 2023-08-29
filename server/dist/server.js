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
(0, initializePassport_1.default)(app);
app.use('/api/users', user_routes_1.default);
app.use('/api/', auth_routes_1.default);
app.use(errorHandler_1.default);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listenning on http://localhost:${PORT}/`);
});
//# sourceMappingURL=server.js.map