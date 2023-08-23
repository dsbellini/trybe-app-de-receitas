import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';

function Footer() {
  return (
    <footer
      data-testid="footer"
      style={ {
        position: 'fixed',
        bottom: 0,
        width: '100%',
      } }
    >
      <Link to="/drinks" data-testid="drinks-bottom-btn">
        <img src={ drinkIcon } alt="Drinks" />
      </Link>
      <Link to="/meals" data-testid="meals-bottom-btn">
        <img src={ mealIcon } alt="Meals" />
      </Link>
    </footer>
  );
}

export default Footer;
