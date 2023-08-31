import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer';
import './style.css';

function Profile() {
  const userMail = JSON.parse(localStorage.getItem('user') || '{}').email;
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    nav('/');
  };

  return (
    <>
      <Header pageTitle="Profile" searchIcon={ false } />
      <h2 className="profile-user">
        User:
      </h2>
      <h2
        data-testid="profile-email"
        className="profile-email"
      >
        {' '}
        {userMail}
      </h2>
      <div
        className="profile-btn-group"
      >
        <Button
          data-testid="profile-done-btn"
          onClick={ () => nav('/done-recipes') }
          className="profile-btns"
          variant="success"
        >
          Done Recipes
        </Button>
        <Button
          data-testid="profile-favorite-btn"
          onClick={ () => nav('/favorite-recipes') }
          className="profile-btns"
          variant="success"
        >
          Favorite Recipes
        </Button>
        <Button
          variant="danger"
          data-testid="profile-logout-btn"
          onClick={ handleLogout }
          className="profile-btns"

        >
          Logout
        </Button>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
