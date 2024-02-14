import bckg from './images/editedLogo.png'

const P5 = () => {
    const handleClick = (e) =>{
    e.preventDefault();
    console.log(e.target.textContent);
  };
  return (
    <>
    <img src={bckg} alt='game logo' className='homeLogo'/>
    <button className="btn" onClick={(e)=> handleClick(e)}>PLAY NOW</button>
    </>
  )
}

export default P5