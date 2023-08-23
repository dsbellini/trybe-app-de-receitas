import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceFood } from '../services';
import { Scope, Revenue, RecommType } from '../exportTypes/types';
import style from './RecipeDetails.module.css';

export type RecipesProps = {
  scope: Scope;
};

function RecipeDetails({ scope }: RecipesProps) {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<Revenue>();
  const [ingAndMea, setIngAndMea] = useState<string[]>([]);
  const [recomm, setRecomm] = useState<Revenue[]>([]);

  const navigate = useNavigate();
  const startRecipe = async () => {
    if (recipe) {
      await localStorage.setItem('recipeInfo', JSON.stringify([]));
      await localStorage.setItem('recipeInfo', JSON.stringify(recipe));
      navigate(`/${scope}/${recipe.idMeal || recipe.idDrink}/in-progress`);
    }
  };

  useEffect(() => {
    const getRecipe = async () => {
      const data = await ServiceFood(scope).getById(recipeId);
      setRecipe(data);
      // separa somente os ingredient do objeto
      const objIng = Object.entries(data);
      const ing = objIng.filter((e) => {
        return e[0].indexOf('strIngredient') > -1 && typeof e[1] === 'string';
      });
      const ingredient = ing.map((e) => e[1]).filter((e) => e !== '');
      // separa somente os measure do objeto
      const objMea = Object.entries(data);
      const mea = objMea.filter((e) => {
        return e[0].indexOf('strMeasure') > -1 && typeof e[1] === 'string';
      });
      const measure = mea.map((e) => e[1]).filter((e) => e !== '');
      // junta ingredient e measure em uma array
      const preparation = [] as string[];
      ingredient.forEach((e, i) => preparation.push(`${measure[i]} ${e}`));
      setIngAndMea(preparation);
    };

    const getRecommendation = async () => {
      const data = await ServiceFood(scope).recommendation() as unknown as RecommType;
      if (scope === 'meals') setRecomm(data.drinks.filter((e, i) => i < 6));
      else setRecomm(data.meals.filter((e, i) => i < 6));
    };

    getRecommendation();
    getRecipe();
  }, []);

  const responsive = {
    mobile: {
      breakpoint: { max: 3000, min: 0 },
      items: 2,
    },
  };

  return (
    <>
      <div>
        <h1 data-testid="recipe-title">
          {recipe?.strMeal || recipe?.strDrink}
        </h1>
        <p data-testid="recipe-category">
          { scope === 'drinks' ? recipe?.strAlcoholic : recipe?.strCategory }
        </p>
        <img
          src={ recipe?.strMealThumb || recipe?.strDrinkThumb }
          alt={ recipe?.strMeal || recipe?.strDrink }
          data-testid="recipe-photo"
          width="420"
          height="315"
        />
        <p data-testid="instructions">
          {recipe?.strInstructions}
        </p>
        { ingAndMea.map((e, i) => (
          <p data-testid={ `${i}-ingredient-name-and-measure` } key={ i }>
            { e }
          </p>
        )) }
        { recipe?.strYoutube
          ? (
            <iframe
              data-testid="video"
              title={ recipe?.strMeal }
              width="420"
              height="315"
              src={ recipe?.strYoutube.replace('watch?v=', 'embed/') }
            />
          )
          : null }
      </div>

      <div>
        <Carousel responsive={ responsive }>
          { recomm.map((element, index) => (
            <span
              data-testid={ `${index}-recommendation-card` }
              key={ element.idMeal || element.idDrink }
            >
              <img
                src={ element.strDrinkThumb
              || element.strMealThumb }
                alt={ element.strMeal
              || element.strDrink }
              />
              <p
                data-testid={ `${index}-recommendation-title` }
              >
                { element.strMeal || element.strDrink}
              </p>
            </span>
          ))}
        </Carousel>
      </div>

      <div className={ style.absolute }>
        <button
          className={ style.btnRecipe }
          onClick={ startRecipe }
          data-testid="start-recipe-btn"
        >
          Start Recipe
        </button>
      </div>

    </>
  );
}

export default RecipeDetails;
