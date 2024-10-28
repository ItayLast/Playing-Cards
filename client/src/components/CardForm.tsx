import React, { useEffect, useState } from "react";
import cardimg from "./manager.png";
import "../cards.css";
import "../App.css";
interface Card {
  id: number;
  suit: string;
  value: string;
}

const CardForm: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [suit, setSuit] = useState("");
  const [value, setValue] = useState("");
  const [randomCard, setRandomCard] = useState<Card | null>(null);
  const [deleteSuit, setDeleteSuit] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cards");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCards(data);
    } catch (error) {}
  };

  const addCard = async () => {
    if (!suit || !value) {
      setMessage("Please provide both suit and value to add a card.");
      return;
    }
    const newCard = { suit, value };

    try {
      const response = await fetch("http://localhost:3000/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        fetchCards();
        setSuit("");
        setValue("");
        setMessage("Card added successfully!");
      }
    } catch (error) {}
  };

  const getRandomCard = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cards/random");
      if (!response.ok) throw new Error("Network response was not ok");
      const card = await response.json();
      setRandomCard(card);
    } catch (error) {}
  };

  const shuffleDeck = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cards", {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchCards();
      setMessage("Deck shuffled successfully!");
    } catch (error) {}
  };

  const deleteCard = async () => {
    const cardToDelete = {
      suit:
        deleteSuit.trim().charAt(0).toUpperCase() +
        deleteSuit.trim().slice(1).toLowerCase(),
      value: deleteValue.trim().toUpperCase(),
    };

    if (!cardToDelete.suit || !cardToDelete.value) {
      setMessage("Please provide both suit and value to delete a card.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardToDelete),
      });

      if (response.ok) {
        fetchCards();
        setDeleteSuit("");
        setDeleteValue("");
        setMessage("Card deleted successfully!");
      } else {
        const errorResponse = await response.json();
        setMessage(`Error deleting card: ${errorResponse.message}`);
      }
    } catch (error) {
      setMessage("Error deleting card.");
    }
  };

  const getCardSuitIcon = (suit: string) => {
    switch (suit) {
      case "Hearts":
        return "♥";
      case "Spades":
        return "♠";
      case "Diamonds":
        return "♦";
      case "Clubs":
        return "♣";
    }
    return "";
  };

  return (
    <div className="main-container">
      <img
        src={cardimg}
        alt="Card Manager"
        style={{ width: "200%", maxWidth: "600px" }}
      />

      <div>
        <h2>Add Card</h2>

        <select value={suit} onChange={(e) => setSuit(e.target.value)}>
          <option value="" disabled>
            Select Suit
          </option>
          <option value="Hearts">Hearts</option>
          <option value="Diamonds">Diamonds</option>
          <option value="Clubs">Clubs</option>
          <option value="Spades">Spades</option>
        </select>

        <select value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="" disabled>
            Select Value
          </option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="J">J</option>
          <option value="Q">Q</option>
          <option value="K">K</option>
          <option value="A">A</option>
        </select>

        <button onClick={addCard}>Add Card</button>
      </div>

      <div>
        <h2>Delete Card</h2>
        <select
          value={deleteSuit}
          onChange={(e) => setDeleteSuit(e.target.value)}
        >
          <option value="" disabled>
            Select Suit
          </option>
          <option value="Hearts">Hearts</option>
          <option value="Diamonds">Diamonds</option>
          <option value="Clubs">Clubs</option>
          <option value="Spades">Spades</option>
        </select>

        <select
          value={deleteValue}
          onChange={(e) => setDeleteValue(e.target.value)}
        >
          <option value="" disabled>
            Select Value
          </option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="J">J</option>
          <option value="Q">Q</option>
          <option value="K">K</option>
          <option value="A">A</option>
        </select>

        <button onClick={deleteCard}>Delete Card</button>
      </div>

      <div>
        <h2>Get Random Card / Shuffle Deck</h2>
        <button onClick={getRandomCard}>Get Random Card</button>
        <button onClick={shuffleDeck}>Shuffle Deck</button>
      </div>
      <div className="playingCards simpleCards">
        {randomCard && (
          <div>
            <h2>Random Card</h2>
            <label
              className={`card rank-${randomCard.value.toLowerCase()} ${randomCard.suit.toLowerCase()}`}
            >
              <span className="rank">{randomCard.value}</span>
              <span className="suit">{getCardSuitIcon(randomCard.suit)}</span>
            </label>
          </div>
        )}
        <h2>Current Cards</h2>

        {cards.length > 0 ? (
          cards.map((card) => (
            <label
              key={card.id}
              className={`card rank-${card.value.toLowerCase()} ${card.suit.toLowerCase()}`}
            >
              <span className="rank">{card.value}</span>
              <span className="suit">{getCardSuitIcon(card.suit)}</span>
            </label>
          ))
        ) : (
          <label>No cards available.</label>
        )}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CardForm;
