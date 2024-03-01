import React from 'react';

const Dashboard = () => {
  // Function to handle clicks on game menu items
  function handleGameMenuClick(event, menuItem) {
    event.preventDefault();

    // Handle redirection for "Play Game" menu item
    if (menuItem === 'Play Game') {
      console.log('Starting the game...');
      // Redirect to the game page
      window.location.href = './level1';
    } else if (menuItem === 'Logout') {
      console.log('Logging out...');
      // Redirect to the homepage
      window.location.href = '/';
    } else {
      console.log('Unknown menu item clicked');
    }
  }

  return (
    <div className='dashboard'>
      {/* Player Profile */}
      <div className='player-profile'>
        <h2>Player Profile</h2>
        <div className='profile-info'>
          <p>
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Level:</strong> 0
          </p>
          <p>
            <strong>Score:</strong> 0
          </p>
        </div>
      </div>

      {/* Game Menu */}
      <div className='game-menu'>
        <h2>Game Menu</h2>
        <ul>
          <li>
            <a
              href='./level1'
              onClick={(event) => handleGameMenuClick(event, 'Play Game')}
            >
              Play Game
            </a>
          </li>
          <li>
            <a
              href='./'
              onClick={(event) => handleGameMenuClick(event, 'Leaderboard')}
            >
              Leaderboard
            </a>
          </li>
          <li>
            <a
              href='./'
              onClick={(event) => handleGameMenuClick(event, 'Logout')}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Settings Menu (dummy content) */}
      <div className='settings-menu'>
        <h2>Settings</h2>
        <ul>
          <li>
            <a href='./'>Sound</a>
          </li>
          <li>
            <a href='./'>Graphics</a>
          </li>
          <li>
            <a href='./'>Controls</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;