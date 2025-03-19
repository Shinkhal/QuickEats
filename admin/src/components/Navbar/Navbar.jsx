import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className='navbar'>
      <img 
        className='logo' 
        src={assets.logo} 
        alt='Logo' 
        onClick={() => navigate('/')} // Navigate to home when clicked
        style={{ cursor: 'pointer' }} // Make it look clickable
      />
      <img className='profile' src={assets.profile_image} alt='Profile' />
    </div>
  );
}

export default Navbar;
