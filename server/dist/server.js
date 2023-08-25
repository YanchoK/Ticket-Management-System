"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const prisma = new PrismaClient();
app.use(express_1.default.json());
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listenning on http://localhost:${port}/`);
});
//# sourceMappingURL=server.js.map