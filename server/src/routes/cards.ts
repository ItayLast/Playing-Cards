import express, { Request, Response } from "express";
import {
  getDeck,
  shuffleDeck,
  addCard,
  deleteCard,
} from "../controllers/deckController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json(getDeck());
});

router.get("/random", (req: Request, res: Response) => {
  const deck = getDeck();
  const randomCard = deck[Math.floor(Math.random() * deck.length)];
  res.json(randomCard);
});

router.post("/", (req: Request, res: Response) => {
  const newCard = req.body;
  const card = addCard(newCard);
  res.status(201).json(card);
});

router.post("/shuffle", (req: Request, res: Response) => {
  shuffleDeck();
  res.json({ message: "Deck shuffled successfully" });
});

router.delete("/", (req: Request, res: Response) => {
  const { suit, value } = req.body;
  const deletedCard = deleteCard(suit, value);

  if (deletedCard) {
    res.json(deletedCard);
  } else {
    res.status(404).json({ message: "Card not found " });
  }
});

export default router;
