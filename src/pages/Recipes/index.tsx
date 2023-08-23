import React from 'react';
import PrincipalFoodPage from '../../components/PrincipalFoodPage';
import PrincipalDrinkPage from '../../components/PrincipalDrinkPage';
import Header from '../../components/Header';

function Recipes() {
  const path = window.location.pathname;

  return (
    <div>
      {path === '/meals' ? <PrincipalFoodPage /> : <PrincipalDrinkPage />}
    </div>
  );
}

export default Recipes;
