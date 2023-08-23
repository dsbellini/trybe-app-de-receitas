import React from 'react';
import PrincipalFoodPage from '../../components/PrincipalFoodPage';
import PrincipalDrinkPage from '../../components/PrincipalDrinkPage';

function Recipes() {
  const path = window.location.pathname;

  return (
    <div style={ { minHeight: 'calc(100vh - 60px)' } }>
      {path === '/meals' ? <PrincipalFoodPage /> : <PrincipalDrinkPage />}
    </div>
  );
}

export default Recipes;
