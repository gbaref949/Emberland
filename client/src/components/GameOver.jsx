import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gameOver from '../pages/images/gameOver.png';

const GameOver = () => {
  return (
    <>
      <img src={gameOver} alt="heart" className='gameOverImg'/>
      <div>GameOver</div>
    </>
  )
}

export default GameOver