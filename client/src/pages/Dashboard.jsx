import React, { useState } from 'react';

const GameDashboard = () => {
  // Define initial player state using React useState hook
  const [player, setPlayer] = useState({
    name: "John Doe",
    level: 0,
    score: 0
  });

  // Function to handle clicks on game menu items
  function handleGameMenuClick(event, menuItem) {
    event.preventDefault();

    // Update player state based on the clicked menu item
    switch (menuItem) {
      case "Play Game":
        // Example: Increase player level by 1
        setPlayer(prevPlayer => ({ ...prevPlayer, level: prevPlayer.level + 1 }));
        console.log("Starting the game...");
        break;
      case "Leaderboard":
        console.log("Viewing the leaderboard...");
        break;
      case "Achievements":
        console.log("Viewing achievements...");
        break;
      default:
        console.log("Unknown menu item clicked");
    }
  }

  return (
    <div className="dashboard">
      {/* Player Profile */}
      <div className="player-profile">
        <h2>Player Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {player.name}</p>
          <p><strong>Level:</strong> {player.level}</p>
          <p><strong>Score:</strong> {player.score}</p>
        </div>
      </div>
      
      {/* Game Menu */}
      <div className="game-menu">
        <h2>Game Menu</h2>
        <ul>
          <li><a href="./level1" onClick={(event) => handleGameMenuClick(event, "Play Game")}>Play Game</a></li>
          <li><a href="./" onClick={(event) => handleGameMenuClick(event, "Leaderboard")}>Leaderboard</a></li>
          <li><a href="./" onClick={(event) => handleGameMenuClick(event, "Achievements")}>Achievements</a></li>
        </ul>
      </div>
      
      {/* Settings Menu (dummy content) */}
      <div className="settings-menu">
        <h2>Settings</h2>
        <ul>
          <li><a href="./">Sound</a></li>
          <li><a href="./">Graphics</a></li>
          <li><a href="./">Controls</a></li>
        </ul>
      </div>
    </div>
  );
};

export default GameDashboard;
