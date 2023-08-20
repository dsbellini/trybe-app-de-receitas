import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const userMail = JSON.parse(localStorage.getItem('user') || '{}').email;
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    nav('/');
  };

  return (
    <>
      <h1>Profile</h1>
      <h2
        data-testid="profile-email"
      >
        {userMail}
      </h2>
      <Button
        data-testid="profile-done-btn"
        onClick={ () => nav('/done-recipes') }
      >
        Done Recipes
      </Button>
      <Button
        data-testid="profile-favorite-btn"
        onClick={ () => nav('/favorite-recipes') }
      >
        Favorite Recipes
      </Button>
      <Button
        variant="danger"
        data-testid="profile-logout-btn"
        onClick={ handleLogout }
      >
        Logout
      </Button>
    </>
  );
}

export default Profile;
