import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ServiceFood } from '../services';
import { Scope, Revenue } from '../exportTypes/types';
import style from './RecipeDetails.module.css';

export type RecipesProps = {
  scope: Scope;
};

function RecipeDetails({ scope }: RecipesProps) {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<Revenue | null>(null);
  const [ingAndMea, setIngAndMea] = useState<string[]>([]);
  const [recomm, setRecomm] = useState<Revenue[][] | undefined>();

  useEffect(() => {
    const getRecipe = async () => {
      const data = await ServiceFood(scope).getById(recipeId);
      setRecipe(data);

      const objIng = Object.entries(data);
      const ing = objIng.filter((e) => {
        return e[0].indexOf('strIngredient') > -1 && typeof e[1] === 'string';
      });
      const ingredient = ing.map((e) => e[1]).filter((e) => e !== '');

      const objMea = Object.entries(data);
      const mea = objMea.filter((e) => {
        return e[0].indexOf('strMeasure') > -1 && typeof e[1] === 'string';
      });
      const measure = mea.map((e) => e[1]).filter((e) => e !== '');
      const preparation = [] as string[];
      ingredient.forEach((e, i) => preparation.push(`${measure[i]} ${e}`));
      setIngAndMea(preparation);
    };

    const getRecommendation = async () => {
      const data = await ServiceFood(scope).recommendation();
      if (scope === 'meals') {
        const r = data?.drinks.filter((e, i) => i < 6);
        if (typeof r !== 'undefined') {
          const groupRecomm = [[r[0], r[1]], [r[2], r[3]], [r[4], r[5]]];
          setRecomm(groupRecomm);
          console.log(groupRecomm);
        }
      } else {
        const r = data?.meals.filter((e, i) => i < 6);
        if (typeof r !== 'undefined') {
          const groupRecomm = [[r[0], r[1]], [r[2], r[3]], [r[4], r[5]]];
          setRecomm(groupRecomm);
          console.log(groupRecomm);
        }
      }
    };
    getRecommendation();
    getRecipe();
  }, []);

  return (
    <>
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

      <div>
        <Carousel>
          { recomm?.map((e, i) => (
            <Carousel.Item key={ i } data-testid={ `${i}-recommendation-card` }>
              <img
                src={ e[0].strMealThumb || e[0].strDrinkThumb }
                alt=""
              />
              <img
                src={ e[1].strMealThumb || e[1].strDrinkThumb }
                alt=""
              />
              <Carousel.Caption>
                <h3
                  data-testid={ `${i}-recommendation-title` }
                >
                  { e[0].strMeal || e[0].strDrink }
                </h3>
                <h3
                  data-testid={ `${i}-recommendation-title` }
                >
                  { e[1].strMeal || e[1].strDrink }
                </h3>
              </Carousel.Caption>
            </Carousel.Item>
          )) }

        </Carousel>
      </div>

      <div className={ style.absolute }>
        <button className={ style.btnRecipe } data-testid="start-recipe-btn">
          Start Recipe
        </button>
      </div>

    </>
  );
}

export default RecipeDetails;
