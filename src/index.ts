import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

const PORT = 3000;

// Define Card and Deck Types
type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
type Value =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

interface Card {
  id: number;
  suit: Suit;
  value: Value;
}

let deck: Card[] = [];

// Initialize a standard deck of 52 cards
function initializeDeck() {
  const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const values: Value[] = [
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
  let id = 1;
  deck = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ id: id++, suit, value });
    });
  });
}

initializeDeck();

// Utility function to shuffle the deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Create the server
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = parse(req.url || "", true);
  const method = req.method;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS"); // Allow specific methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow specific headers

  // Handle preflight OPTIONS requests
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Set JSON header for response
  res.setHeader("Content-Type", "application/json");

  // Handle different API routes
  if (url.pathname === "/api/cards" && method === "GET") {
    // Get all cards
    res.statusCode = 200;
    res.end(JSON.stringify(deck));
  } else if (url.pathname === "/api/cards/random" && method === "GET") {
    // Get a random card
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    res.statusCode = 200;
    res.end(JSON.stringify(randomCard));
  } else if (url.pathname === "/api/cards" && method === "POST") {
    // Add a new card to the deck
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const newCard: Card = JSON.parse(body);
      newCard.id = deck.length ? deck[deck.length - 1].id + 1 : 1;
      deck.push(newCard);
      res.statusCode = 201;
      res.end(JSON.stringify(newCard));
    });
  } else if (url.pathname === "/api/cards/shuffle" && method === "POST") {
    // Shuffle the deck
    shuffleDeck();
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Deck shuffled successfully" }));
  } else if (url.pathname === "/api/cards" && method === "DELETE") {
    // Delete a card by suit and value
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { suit, value }: { suit: Suit; value: Value } = JSON.parse(body);
      const cardIndex = deck.findIndex(
        (card) => card.suit === suit && card.value === value
      );
      if (cardIndex > -1) {
        const deletedCard = deck.splice(cardIndex, 1);
        res.statusCode = 200;
        res.end(JSON.stringify(deletedCard));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Card not found" }));
      }
    });
  } else {
    // Route not found
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
