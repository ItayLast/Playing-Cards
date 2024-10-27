"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dackController_1 = require("../controllers/dackController");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json((0, dackController_1.getDeck)());
});
router.get("/random", (req, res) => {
    const deck = (0, dackController_1.getDeck)();
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    res.json(randomCard);
});
router.post("/", (req, res) => {
    const newCard = req.body;
    const card = (0, dackController_1.addCard)(newCard);
    res.status(201).json(card);
});
router.post("/shuffle", (req, res) => {
    (0, dackController_1.shuffleDeck)();
    res.json({ message: "Deck shuffled successfully" });
});
router.delete("/", (req, res) => {
    const { suit, value } = req.body;
    const deletedCard = (0, dackController_1.deleteCard)(suit, value);
    if (deletedCard) {
        res.json(deletedCard);
    }
    else {
        res.status(404).json({ message: "Card not found" });
    }
});
exports.default = router;
