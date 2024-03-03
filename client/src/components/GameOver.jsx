import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gameOver from '../pages/images/brokenHeart.png';


const GameOver = () => {
  const navigate = useNavigate();

  return (
    <div className='gameOverCont'>
      <h1 className='gameOverTitle'>GameOver</h1>
      <img src={gameOver} alt="heart" className='gameOverImg' />
      <div className="gameOverBtnCont">
        <Link to={'/level1'} className='gameOverBtn'>Play Again</Link>
        <Link to={'/dashboard'} className='gameOverBtn'>Dashboard</Link>
      </div>
    </div>
  )
}

export default GameOver;
