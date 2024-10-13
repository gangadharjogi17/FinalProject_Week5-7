import "./App.css";
import PlayerTable from "./components/PlayerComponent.jsx";
import { useState } from "react";

function App() {
  const [pageTitle, setPageTitle] = useState("Sports - Players Details");

  return (
    <>
      <h1>Sports - Players Details</h1>
      <button onClick={() => setPageTitle("View All Players")}
	  style={{ backgroundColor: "#1abc9c", color: "white", marginRight: "10px" }}>
        Display All Players
      </button>
      <button onClick={() => setPageTitle("Add New Player")}
	  style={{ backgroundColor: "#1abc9c", color: "white", marginRight: "10px" }}>
        Add New Player
      </button>
	  <PlayerTable action={pageTitle} />
    </>
  );
}

export default App;
