"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleDeck = shuffleDeck;
exports.getDeck = getDeck;
exports.addCard = addCard;
exports.deleteCard = deleteCard;
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
];
let deck;
(function initializeDeck() {
    let id = 1;
    deck = [];
    suits.forEach((suit) => {
        values.forEach((value) => {
            deck.push({ id: id++, suit, value });
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
    newCard.id = deck.length ? deck[deck.length - 1].id + 1 : 1;
    deck.push(newCard);
    return newCard;
}
function deleteCard(suit, value) {
    const index = deck.findIndex((card) => card.suit === suit && card.value === value);
    return index !== -1 ? deck.splice(index, 1)[0] : null;
}
