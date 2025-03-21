import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Apply middleware before routes
app.use(cors({
  origin: '*',  // Allow all origins for development
  methods: ['GET', 'POST'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static("dist"));
app.use(express.json());
app.use(bodyParser.json());

// GET route for home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// POST route to handle trip data
app.post("/tripData", (req, res) => {
  try {
    const tripData = req.body;
    console.log("Received trip data:", tripData);
    res.status(200).json({
      message: "Trip data received successfully",
      data: tripData
    });
  } catch (error) {
    console.error("Error processing trip data:", error);
    res.status(500).json({ error: "Failed to process trip data" });
  }
});

const server = app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});

export { app, server };