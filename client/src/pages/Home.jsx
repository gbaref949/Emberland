import bckg from './images/editedLogo.png';

const Home = () => {
  return (
    <>
      <img src={bckg} alt='game logo' className='homeLogo' />
      <a href='./dashboard' className='btn'>
        <p className='btn-text'>PLAY</p>
      </a>
    </>
  )
}

export default Home