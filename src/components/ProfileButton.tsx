import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import profileImg from '../images/profileIcon.svg';
import './ProfileButtonCSS.css';

export default function ProfileButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="link"
      onClick={ () => navigate('/profile') }
    >
      <img
        data-testid="profile-top-btn"
        src={ profileImg }
        alt="profile icon"
        className="profile-button"
      />
    </Button>
  );
}
