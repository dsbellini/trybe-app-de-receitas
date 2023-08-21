import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Revenue } from './exportTypes/types';
import { RevenueContext } from './RevenuesContext';
import style from './RevenueCard.module.css';

export type RevenueCardProps = {
  recipe: Revenue;
  index: number;
};

function RevenueCard({ recipe, index }: RevenueCardProps) {
  const { state } = useContext(RevenueContext);
  const navigate = useNavigate();
  const cardClick = () => {
    navigate(`/${state.scope}/${recipe.idMeal || recipe.idDrink}`);
  };

  return (
    <button
      onClick={ cardClick }
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
        { recipe.strDrink || recipe.strMeal }
      </div>
    </button>
  );
}

export default RevenueCard;
