import { v4 as uuidv4 } from "uuid";

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

export type Suit = (typeof suits)[number];
export type Value = (typeof values)[number];

export type Card = {
  id: string;
  suit: Suit;
  value: Value;
};

let deck: Card[];

(function initializeDeck() {
  deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ id: uuidv4(), suit, value }); // Use uuid for the ID
    });
  });
})();

export function shuffleDeck(): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function getDeck(): Card[] {
  return deck;
}

export function addCard(newCard: Card): Card {
  newCard.id = uuidv4(); // u cant use deck length for id FIXED
  deck.push(newCard);
  return newCard;
}

export function deleteCard(suit: Suit, value: Value): Card | null {
  const index = deck.findIndex(
    (card) => card.suit === suit && card.value === value
  );
  return index !== -1 ? deck.splice(index, 1)[0] : null;
}
