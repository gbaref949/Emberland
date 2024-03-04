import {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './images/editedLogo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  let signedIn = sessionStorage.getItem('authenticated') || false;
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const [people, setPeople] = useState([]);

  useEffect(()=>{
    if(signedIn == 'false'){
      console.log('navigating')
      navigate('/login');
    }
    fetch('http://localhost:5000/').then(response =>{
      return response.json();
    }).then(res=>{
      setPeople(res);
    });
  }, []);
  
  people.map(person=>{
    if(person.email == currentUser.email){
      currentUser = person;
    }
  })
  
  // Function to handle clicks on game menu items
  function handleGameMenuClick(event, menuItem) {
    event.preventDefault();

    navigate(`${menuItem}`);
  }

  function logout(){
    sessionStorage.setItem('authenticated', false);
    navigate('/login');
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
                <strong>Name:</strong> {currentUser.username}
              </p>
              <p>
                <strong>Best Score:</strong> {currentUser.bestScore}
              </p>
              <p>
                <strong>Overall Score:</strong> {currentUser.overallScore}
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
                <Link to={'/leaderboard'}>Leaderboard</Link>
              </li>
              <li>
                <Link onClick={logout}>Logout</Link>
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