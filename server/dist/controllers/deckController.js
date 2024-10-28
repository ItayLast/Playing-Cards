"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleDeck = shuffleDeck;
exports.getDeck = getDeck;
exports.addCard = addCard;
exports.deleteCard = deleteCard;
const uuid_1 = require("uuid");
const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
]; //Keeping these as is
let deck;
(function initializeDeck() {
    deck = [];
    suits.forEach((suit) => {
        values.forEach((value) => {
            deck.push({ id: (0, uuid_1.v4)(), suit, value }); // Use uuid for the ID
        });
    });
})();
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}
function getDeck() {
    return deck;
}
function addCard(newCard) {
    newCard.id = (0, uuid_1.v4)(); // u cant use deck length for id FIXED
    deck.push(newCard);
    return newCard;
}
function deleteCard(suit, value) {
    const index = deck.findIndex((card) => card.suit === suit && card.value === value);
    return index !== -1 ? deck.splice(index, 1)[0] : null;
}
