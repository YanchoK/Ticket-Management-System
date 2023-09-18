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
const imagekit_1 = __importDefault(require("imagekit"));
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
const imagekit = new imagekit_1.default({
    urlEndpoint: 'https://ik.imagekit.io/cphn9i2ad',
    publicKey: 'public_FM4rPUXRbrL+rmMEN7dch8Da28k=',
    privateKey: 'private_yq8HfqFxGkghrqa4Tzk63cJJCfY='
});
app.get('/api/imageAuth', function (req, res) {
    var result = imagekit.getAuthenticationParameters();
    res.send(result);
});
app.post('/api/uploadImage', function (req, res) {
    console.log(req);
    res.send(req);
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