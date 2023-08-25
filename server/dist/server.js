"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/api", (req, res) => {
    try {
        res.json({ message: "Hello World!" });
    }
    catch (error) {
        res.send(error.message);
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listenning on http://localhost:${PORT}/`);
});
//# sourceMappingURL=server.js.map