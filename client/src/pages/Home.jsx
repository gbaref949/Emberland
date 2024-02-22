import bckg from './images/editedLogo.png'

const P5 = () => {
  
  return (
    <>
      <img src={bckg} alt='game logo' className='homeLogo' />
      <a href='./game1' className='btn' >
        PLAY NOW
      </a>
    </>
  );
}

export default P5