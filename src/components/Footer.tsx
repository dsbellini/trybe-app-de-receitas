import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';

function Footer() {
  return (
    <footer
      data-testid="footer"
      style={ {
        bottom: 0,
        width: '100%',
      } }
    >
      <div style={ { textAlign: 'center' } }>
        <Link to="/drinks" data-testid="drinks-bottom-btn" src={ drinkIcon }>
          <img src={ drinkIcon } alt="Drinks" />
        </Link>
        <Link to="/meals" data-testid="meals-bottom-btn" src={ mealIcon }>
          <img src={ mealIcon } alt="Meals" />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
