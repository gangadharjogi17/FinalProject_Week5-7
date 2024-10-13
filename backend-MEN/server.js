const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors');

const mongoose = require('mongoose')

// Use CORS to allow requests from the frontend running at this specific address
app.use(cors({ origin: 'http://127.0.0.1:5173' }));

// Define a root route to respond with a simple message for testing server responsiveness
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import routes related to player management
const playerRoutes = require("./routes/players");
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Registering the player-related routes under the "/api/players" path
app.use("/api/players", playerRoutes);

// Connecting to the MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/sportsDB")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log("Example app listening on port" + port);
    });
  })
  .catch((err) => console.error("Failed to connect", err));