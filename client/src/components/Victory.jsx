import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import victory from '../pages/images/trophy.png';

const Victory = () => {
    const navigate = useNavigate();

    return (
      <div className='victoryCont'>
        <h1 className='victoryTitle'>Victory</h1>
        <img src={victory} alt="heart" className='victoryImg' />
        <div className="victoryBtnCont">
          <Link to={'/dashboard'} className='victoryBtn'>Dashboard</Link>
        </div>
      </div>
    )
}

export default Victory