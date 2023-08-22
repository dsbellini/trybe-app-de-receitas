import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';

test('renders footer with correct icons', () => {
  const { getByTestId } = render(
    <Router>
      <Footer />
    </Router>
  );

  const drinksIcon = getByTestId('drinks-bottom-btn').querySelector('img');
  const mealsIcon = getByTestId('meals-bottom-btn').querySelector('img');

  expect(drinksIcon).toBeInTheDocument();
  expect(drinksIcon.src).toContain('drinkIcon.svg');
  
  expect(mealsIcon).toBeInTheDocument();
  expect(mealsIcon.src).toContain('mealIcon.svg');
});

test('footer is fixed to the bottom of the page', () => {
  const { getByTestId } = render(
    <Router>
      <Footer />
    </Router>
  );

  const footer = getByTestId('footer');

  expect(footer).toBeInTheDocument();
  expect(footer).toHaveStyle('position: fixed');
  expect(footer).toHaveStyle('bottom: 0');
  expect(footer).toHaveStyle('width: 100%');
});
