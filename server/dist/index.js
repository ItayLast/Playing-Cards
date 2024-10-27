"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cards_1 = __importDefault(require("./routes/cards"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
// Routes
app.use("/api/cards", cards_1.default);
// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
