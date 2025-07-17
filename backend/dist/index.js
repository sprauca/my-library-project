"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', user_1.default);
app.use('/auth', auth_1.default);
app.get('/', (_req, res) => {
    res.send('Welcome to the API backend!');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API backend running on http://localhost:${port}`);
});
exports.default = app;
