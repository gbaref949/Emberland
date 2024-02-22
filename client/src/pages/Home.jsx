import bckg from './images/editedLogo.png'

const P5 = () => {

  return (
    <>
      <img src={bckg} alt='game logo' className='homeLogo' />
      <a href='./game1' className='btn'>
        <p className='btn-text'>PLAY</p>
      </a>
    </>
  );
}

export default P5