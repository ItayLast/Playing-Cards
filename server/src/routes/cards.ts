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

router.patch("/", (req: Request, res: Response) => {
  shuffleDeck();
  res.json({ message: "Deck shuffled successfully" }); // u dont return any http code res. please use http correctly FIXED
  res.status(200).json({ message: "Deck shuffled successfully" });
});

router.delete("/:suit/:value", (req: Request, res: Response) => {
  const { suit, value } = req.params; // Extract suit and value from URL parameters
  const deletedCard = deleteCard(suit, value);

  if (deletedCard) {
    res
      .status(200)
      .json({ message: "Card deleted successfully", card: deletedCard });
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// DELETE http://api/$value/$suit

export default router;
