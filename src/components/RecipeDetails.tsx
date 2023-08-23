import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceFood } from '../services';
import { Scope, Revenue, RecommType, FavoriteType } from '../exportTypes/types';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import style from './RecipeDetails.module.css';

export type RecipesProps = {
  scope: Scope;
};

function RecipeDetails({ scope }: RecipesProps) {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<Revenue>();
  const [ingAndMea, setIngAndMea] = useState<string[]>([]);
  const [recomm, setRecomm] = useState<Revenue[]>([]);
  const [stateRecipe, setStateRecipe] = useState();
  const [copySuccess, setCopySuccess] = useState(false);
  const [hearteMark, setHearteMark] = useState(false);

  const navigate = useNavigate();
  const startRecipe = () => {
    if (recipe) {
      localStorage.setItem('recipeInfo', JSON.stringify([]));
      localStorage.setItem('recipeInfo', JSON.stringify(recipe));
      navigate(`/${scope}/${recipe.idMeal || recipe.idDrink}/in-progress`);
    }
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin; // Obtém o domínio base do site
    const recipeLink = `${baseUrl}/${scope}/${recipe?.idDrink || recipe?.idMeal}`; // Gerar o link da receita

    navigator.clipboard.writeText(recipeLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000); // Remove a mensagem após 3 segundos
    });
  };

  const checkFavorite = () => {
    if (localStorage.getItem('favoriteRecipes') !== null) {
      const favorited = JSON.parse(localStorage
        .getItem('favoriteRecipes') || '[]') as FavoriteType[];
      const yesOrNo = favorited.some((e) => e.id === (recipe?.idDrink || recipe?.idMeal));
      setHearteMark(yesOrNo);
      console.log(yesOrNo);
    }
  };

  const handleFavorite = () => {
    const favoriteRecipe = {
      id: recipe?.idDrink || recipe?.idMeal,
      type: scope.slice(0, -1),
      nationality: recipe?.strArea || '',
      category: recipe?.strCategory,
      alcoholicOrNot: recipe?.strAlcoholic || '',
      name: recipe?.strDrink || recipe?.strMeal,
      image: recipe?.strDrinkThumb || recipe?.strMealThumb,
    } as FavoriteType;
    if (localStorage.getItem('favoriteRecipes') !== null) {
      const favorited = JSON.parse(localStorage
        .getItem('favoriteRecipes') || '[]') as FavoriteType[];
      const yesOrNo = favorited.some((e) => e.id === (recipe?.idDrink || recipe?.idMeal));
      if (!yesOrNo) {
        localStorage
          .setItem('favoriteRecipes', JSON.stringify([...favorited, favoriteRecipe]));
      }
    } else {
      localStorage
        .setItem('favoriteRecipes', JSON.stringify([favoriteRecipe]));
    }
    checkFavorite();
  };

  useEffect(() => {
    const getRecipe = async () => {
      const data = await ServiceFood(scope).getById(recipeId);
      setRecipe(data);
      // separa somente os ingredient do objeto
      const ingredient = Object.entries(data).filter((e) => {
        return e[0].indexOf('strIngredient') > -1 && typeof e[1] === 'string';
      }).map((e) => e[1]).filter((e) => e !== '');
      // separa somente os measure do objeto
      const measure = Object.entries(data).filter((e) => {
        return e[0].indexOf('strMeasure') > -1 && typeof e[1] === 'string';
      }).map((e) => e[1]).filter((e) => e !== '');
      // junta ingredient e measure em uma array
      const preparation = [] as string[];
      ingredient.forEach((e, i) => preparation.push(`${measure[i]} ${e}`));
      setIngAndMea(preparation);
      if (localStorage.getItem('favoriteRecipes') !== null) {
        const favorited = JSON.parse(localStorage
          .getItem('favoriteRecipes') || '[]') as FavoriteType[];
        const yesOrNo = favorited
          .some((e) => e.id === (data?.idDrink || data?.idMeal));
        setHearteMark(yesOrNo);
        console.log(yesOrNo);
      }
    };

    const getRecommendation = async () => {
      const data = await ServiceFood(scope).recommendation() as unknown as RecommType;
      if (scope === 'meals') setRecomm(data.drinks.filter((e, i) => i < 6));
      else setRecomm(data.meals.filter((e, i) => i < 6));
    };

    const getStateRecipe = () => {
      const progress = JSON.parse(localStorage
        .getItem('inProgressRecipes') || '[]') as [];
      const state = progress.find((e) => e === true);
      console.log(state);
    };

    getStateRecipe();
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

      <div>
        { copySuccess === true ? <p>Link copied!</p> : null }
        <button
          data-testid="share-btn"
          onClick={ handleCopyLink }
        >
          <img src={ shareIcon } alt="share-icon" />
        </button>
        <button
          onClick={ handleFavorite }
        >
          { hearteMark
            ? <img src={ blackHeart } alt="black" data-testid="favorite-btn" />
            : <img src={ whiteHeart } alt="white" data-testid="favorite-btn" />}
        </button>
      </div>
    </>
  );
}

export default RecipeDetails;
