import React, { useEffect, useState } from "react";
import cardimg from "./manager.png";
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

  // Fetch all cards on component mount
  useEffect(() => {
    fetchCards();
  }, []);

  // Function to fetch all cards from the API
  const fetchCards = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cards");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // Function to add a new card to the deck
  const addCard = async () => {
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
        fetchCards(); // Refresh the card list
        setSuit("");
        setValue("");
        setMessage("Card added successfully!");
      } else {
        console.error("Error adding card:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  // Function to get a random card
  const getRandomCard = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cards/random");
      if (!response.ok) throw new Error("Network response was not ok");
      const card = await response.json();
      setRandomCard(card);
    } catch (error) {
      console.error("Error fetching random card:", error);
    }
  };

  // Function to shuffle the deck
  const shuffleDeck = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cards/shuffle", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchCards(); // Refresh the card list after shuffling
      setMessage("Deck shuffled successfully!");
    } catch (error) {
      console.error("Error shuffling deck:", error);
    }
  };

  // Function to delete a card by suit and value
  const deleteCard = async () => {
    const cardToDelete = {
      suit:
        deleteSuit.trim().charAt(0).toUpperCase() +
        deleteSuit.trim().slice(1).toLowerCase(),
      value: deleteValue.trim().toUpperCase(),
    };

    // Check if suit and value are provided
    if (!cardToDelete.suit || !cardToDelete.value) {
      setMessage("Please provide both suit and value to delete a card.");
      return;
    }

    console.log("Attempting to delete:", cardToDelete); // Log cardToDelete object

    try {
      const response = await fetch("http://localhost:3000/api/cards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardToDelete),
      });

      if (response.ok) {
        fetchCards(); // Refresh the card list after deletion
        setDeleteSuit("");
        setDeleteValue("");
        setMessage("Card deleted successfully!");
      } else {
        const errorResponse = await response.json();
        setMessage(`Error deleting card: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      setMessage("Error deleting card.");
    }
  };

  return (
    <div className="main-container">
      <img
        src={cardimg}
        alt="Card Manager"
        style={{ width: "100%", maxWidth: "400px" }}
      />
      <div>
        <h2>Add Card</h2>
        <input
          type="text"
          placeholder="Suit (Hearts, Diamonds, Clubs, Spades)"
          value={suit}
          onChange={(e) => setSuit(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value (2-10, J, Q, K, A)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={addCard}>Add Card</button>
      </div>
      <div>
        <h2>Delete Card</h2>
        <input
          type="text"
          placeholder="Suit (Hearts, Diamonds, Clubs, Spades)"
          value={deleteSuit}
          onChange={(e) => setDeleteSuit(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value (2-10, J, Q, K, A)"
          value={deleteValue}
          onChange={(e) => setDeleteValue(e.target.value)}
        />
        <button onClick={deleteCard}>Delete Card</button>
      </div>
      <div>
        <h2>Get Random Card / Shuffle Deck</h2>
        <button onClick={getRandomCard}>Get Random Card</button>
        <button onClick={shuffleDeck}>Shuffle Deck</button>
      </div>
      <h2>Current Cards</h2>
      <ul>
        {cards.length > 0 ? (
          cards.map((card) => (
            <li key={card.id}>
              {card.value} of {card.suit}
            </li>
          ))
        ) : (
          <li>No cards available.</li>
        )}
      </ul>
      {randomCard && (
        <div>
          <h2>Random Card</h2>
          <p>
            {randomCard.value} of {randomCard.suit}
          </p>
        </div>
      )}
      {message && <p>{message}</p>} {/* Display message */}
    </div>
  );
};

export default CardForm;
