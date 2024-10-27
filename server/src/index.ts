import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cardsRouter from "./routes/cards";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

// Routes
app.use("/api/cards", cardsRouter);

// Handle unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
