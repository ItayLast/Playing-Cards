// src/App.tsx
import React from "react";
import "./styles/style.css";
import "./styles/App.css";
import CardForm from "./components/CardForm";

const App: React.FC = () => {
  return (
    <div className="App">
      <CardForm />
    </div>
  );
};

export default App;
