"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deckController_1 = require("../controllers/deckController");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json((0, deckController_1.getDeck)());
});
router.get("/random", (req, res) => {
    const deck = (0, deckController_1.getDeck)();
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    res.json(randomCard);
});
router.post("/", (req, res) => {
    const newCard = req.body;
    const card = (0, deckController_1.addCard)(newCard);
    res.status(201).json(card);
});
router.patch("/", (req, res) => {
    (0, deckController_1.shuffleDeck)();
    res.json({ message: "Deck shuffled successfully" }); // u dont return any http code res. please use http correctly FIXED
    res.status(200).json({ message: "Deck shuffled successfully" });
});
router.delete("/:suit/:value", (req, res) => {
    const { suit, value } = req.params; // Extract suit and value from URL parameters
    const deletedCard = (0, deckController_1.deleteCard)(suit, value);
    if (deletedCard) {
        res
            .status(200)
            .json({ message: "Card deleted successfully", card: deletedCard });
    }
    else {
        res.status(404).json({ message: "Card not found" });
    }
});
// DELETE http://api/$value/$suit
exports.default = router;
