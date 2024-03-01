import bckg from './images/editedLogo.png';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <img src={bckg} alt='game logo' className='homeLogo' />
      <Link to={'/dashboard'} className='btn'><p className='btn-text'>PLAY</p></Link>
    </>
  )
}

export default Home