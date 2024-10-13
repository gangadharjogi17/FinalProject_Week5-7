const express = require("express");
const router = express.Router();
const Player = require('../models/playerModel')
const mongoose = require('mongoose')

// POST route to add a new player
router.post("/", async (req, res) => {
  const { name, number, position } = req.body;

  try {
    // Before creating a new player, we want to ensure that there are no duplicates.
    // This prevents data inconsistencies and maintains the integrity of player information.
    const existingPlayer = await Player.findOne({ name, number });
    if (existingPlayer) {
	  // If a player already exists, we respond with an error status and message.
      return res.status(400).json({ message: "Player already exists." });
    }

    // If no duplicates, we proceed to create a new player.
    const newPlayer = new Player({ name, number, position });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).json({ message: "Error adding player." });
  }
});

// GET all players
router.get("/", async (req, res) => {
  const players = await Player.find();
  res.status(200).json(players);
});

// GET a single player
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Player does not exist." });
  }
  const player = await Player.findById(id);
  if (!player) {
    return res.status(404).json({ error: "Player does not exist." });
  }
  res.status(200).json(player);
});


router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;

  // Again, we validate the ID to ensure we are working with a valid resource.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Player does not exist." });
  }

  try {
    // Check if another player with the same name and number exists (excluding the current player)
    const existingPlayer = await Player.findOne({
      $and: [
        { _id: { $ne: id } }, // Exclude the current player by ID
        { name: name },
        { number: number }
      ]
    });

    if (existingPlayer) {
      return res.status(400).json({ message: "Another player with the same name and number exists." });
    }

    const player = await Player.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!player) {
      return res.status(404).json({ error: "Player does not exist." });
    }
    res.status(200).json(player);
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Error updating player." });
  }
});


// DELETE a single player
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Player does not exist." });
  }
  const player = await Player.findOneAndDelete({ _id: id });
  if (!player) {
    return res.status(404).json({ error: "Player does not exist." });
  }
  res.status(200).json(player);
});



module.exports = router;