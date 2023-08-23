import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RevenueContext } from '../../context/RevenuesContext';
import { Revenue } from '../../exportTypes/types';
import style from './RevenueCard.module.css';

function RevenueList() {
  const { state } = useContext(RevenueContext);
  const navigate = useNavigate();
  const cardClick = (recipe: Revenue) => {
    navigate(`/${state.scope}/${recipe.idMeal || recipe.idDrink}`);
  };
  return (
    <div>
      { state.recipes.map((recipe, index) => (
        <div key={ recipe.idDrink || recipe.idMeal }>
          <button
            onClick={ () => cardClick(recipe) }
            className={ style.wrapper }
            data-testid={ `${index}-recipe-card` }
          >
            <img
              className={ style.thumbnail }
              src={ recipe.strDrinkThumb || recipe.strMealThumb }
              alt={ recipe.strDrink || recipe.strMeal }
              data-testid={ `${index}-card-img` }
            />
            <div className={ style.name } data-testid={ `${index}-card-name` }>
              {recipe.strDrink || recipe.strMeal }
            </div>
          </button>
        </div>
      )) }
    </div>
  );
}

export default RevenueList;
