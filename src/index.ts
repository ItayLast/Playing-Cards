import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

const PORT = 3000;

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

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = parse(req.url || "", true);
  const method = req.method;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");

  if (url.pathname === "/api/cards" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(deck));
  } else if (url.pathname === "/api/cards/random" && method === "GET") {
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    res.statusCode = 200;
    res.end(JSON.stringify(randomCard));
  } else if (url.pathname === "/api/cards" && method === "POST") {
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
    shuffleDeck();
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Deck shuffled successfully" }));
  } else if (url.pathname === "/api/cards" && method === "DELETE") {
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
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
