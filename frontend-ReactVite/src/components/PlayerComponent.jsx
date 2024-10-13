import { useState, useEffect } from "react";
import axios from "axios";

function PlayerTable({ action }) {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false); // To track update mode

  // Function to fetch all players from the API, ensuring we always have the latest data in the UI
  const getAllPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  // Function to Add a new Player: Allows the user to input new player data.
  const addPlayer = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/players", {
        name,
        number,
        position,
      });
      console.log("Player added:", response.data);
      getAllPlayers(); // Refresh the player list
    } catch (error) {
      console.error("Error adding player:", error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Show the duplicate player message
      } else {
        alert("An unexpected error occurred."); // Handle other errors
      }
    }
  };
  
  //Function to update an existing player - Pre-populates fields with player data to modify.
  const updatePlayer = async () => {
    if (!playerId) {
        alert("Please select a player to update.");
        return;
    }

    try {
        const response = await axios.patch(`http://localhost:3000/api/players/${playerId}`, {
            name,
            number,
            position,
        });
        console.log("Player updated:", response.data);
        getAllPlayers(); // Refresh the player list
        resetForm(); // Reset the form fields
    } catch (error) {
        console.error("Error updating player:", error.response ? error.response.data : error);
        alert("Another player with the same name and number exists.");
    }
};

	//Function to delete a player: Requires only the player ID for removal.
  const deletePlayer = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/players/${id}`);
      console.log("Player deleted:", response.data);
      getAllPlayers(); // Refresh the player list
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  // Reset the form after updating a player
  // This ensures that after the update is completed, the input fields are cleared
  const resetForm = () => {
    setName("");
    setNumber("");
    setPosition("");
    setPlayerId("");
    setIsUpdating(false);
  };

  useEffect(() => {
    if (action === "View All Players") {
      getAllPlayers();
    }
  }, [action]);

  // Renders the table of players, providing a clear view of player information
  const renderTable = () => (
    <div>
      <h2>All Players Information</h2>
      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Player Number</th>
            <th>Position</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id}>
              <td>{player.name}</td>
              <td>{player.number}</td>
              <td>{player.position}</td>
              <td>
                <button onClick={() => {
                  setIsUpdating(true);
                  setPlayerId(player._id);
                  setName(player.name);
                  setNumber(player.number);
                  setPosition(player.position);
                }}
				style={{ backgroundColor: "#f1c40f", color: "white", marginRight: "10px" }}>
                  Update
                </button>
                <button onClick={() => deletePlayer(player._id)}
				style={{ backgroundColor: "#d8bfd8", color: "white", marginRight: "10px" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Renders the form to add a new player, central to managing team composition
  const renderAddPlayerForm = () => (
    <div>
      <h2>Add New Player</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPlayer();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <button type="submit" style={{ backgroundColor: "#b0c4de", color: "white", marginRight: "10px" }}>Add Player</button>
      </form>
    </div>
  );

 //Renders the form to update an existing player
  const renderUpdatePlayerForm = () => (
    <div>
      <h2>Update Player</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePlayer();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <button type="submit">Update Player</button>
      </form>
    </div>
  );

  //Renders the form for deleting a player
  const renderDeletePlayerForm = () => (
    <div>
      <h2>Delete Player</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          deletePlayer(playerId);
        }}
      >
        <input
          type="text"
          placeholder="Player ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          required
        />
        <button type="submit">Delete Player</button>
      </form>
    </div>
  );

  //Main render method, providing a unified interface for all player management features
  return (
    <>
      {action === "View All Players" && renderTable()}
      {action === "Add New Player" && renderAddPlayerForm()}
      {isUpdating && renderUpdatePlayerForm()}
      {action === "Delete Player" && renderDeletePlayerForm()}
    </>
  );
}

export default PlayerTable;
