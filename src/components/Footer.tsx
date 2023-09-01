import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.png';
import mealIcon from '../images/mealIcon.png';
import './Footer.css';

function Footer() {
  return (
    <footer
      data-testid="footer"
      className="footer-container"
    >
      <div className="icon-container">
        <Link to="/meals" data-testid="meals-bottom-btn" className="icon-link">
          <img src={ mealIcon } alt="Meals" className="icon" />
        </Link>
        <Link to="/drinks" data-testid="drinks-bottom-btn" className="icon-link">
          <img src={ drinkIcon } alt="Drinks" className="icon" />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
