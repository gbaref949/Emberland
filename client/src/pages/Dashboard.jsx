import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './images/editedLogo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  // Function to handle clicks on game menu items
  function handleGameMenuClick(event, menuItem) {
    event.preventDefault();

    navigate(`${menuItem}`);
  }

  return (
    <div className="dashBoardCont">
      <div className='dashboard'>
        <h1 className='title'>Dashboard</h1>
        <div className="imgCont">
          <img src={Logo} alt="logo" className='dashBoardImg'/>
        </div>

        {/* Player Profile */}
        <div className="sections">
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
                <Link to={'/level1'}>Play Game</Link>
              </li>
              <li>
                <Link to={'/dashboard'}>Leaderboard</Link>
              </li>
              <li>
                <Link to={'/'}>Logout</Link>
              </li>
            </ul>
          </div>

          {/* Settings Menu (dummy content) */}
          <div className='settings-menu'>
            <h2>Settings</h2>
            <ul>
              <li>
                <Link to={'/dashboard'}>Sound</Link>
              </li>
              <li>
                <Link to={'/dashboard'}>Graphics</Link>
              </li>
              <li>
                <Link to={'/dashboard'}>Controls</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;