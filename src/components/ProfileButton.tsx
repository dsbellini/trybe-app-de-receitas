import { useNavigate } from 'react-router-dom';
import profileImg from '../images/profileIcon.svg';

export default function ProfileButton() {
  const navigate = useNavigate();
  return (
    <button onClick={ () => navigate('/profile') }>
      <img
        data-testid="profile-top-btn"
        src={ profileImg }
        alt="profile icon"
      />
    </button>
  );
}
