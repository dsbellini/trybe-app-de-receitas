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
  const [stateRecipe, setStateRecipe] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [hearteMark, setHearteMark] = useState(false);

  const navigate = useNavigate();
  // muda a rota para a pagina de receitas em progresso
  const handleStartRecipe = () => {
    if (recipe) {
      navigate(`/${scope}/${recipe.idMeal || recipe.idDrink}/in-progress`);
    }
  };
  // copia o link da receita
  const handleCopyLink = () => {
    const baseUrl = window.location.origin; // Obtém o domínio base do site
    const recipeLink = `${baseUrl}/${scope}/${recipe?.idDrink || recipe?.idMeal}`; // Gerar o link da receita

    navigator.clipboard.writeText(recipeLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000); // Remove a mensagem após 3 segundos
    });
  };
  // muda o preenchinebto do botão de favoritar a receita
  const checkFavorite = () => {
    if (localStorage.getItem('favoriteRecipes') !== null) {
      const favorited = JSON.parse(localStorage
        .getItem('favoriteRecipes') || '[]') as FavoriteType[];
      const yesOrNo = favorited.some((e) => e.id === (recipe?.idDrink || recipe?.idMeal));
      setHearteMark(yesOrNo);
    }
  };
  // favorita a receira e manda para o localStorage
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
        console.log([...favorited, favoriteRecipe]);
      } else {
        const removeRecipe = favorited
          .filter((e) => e.id !== (recipe?.idDrink || recipe?.idMeal));
        localStorage
          .setItem('favoriteRecipes', JSON.stringify(removeRecipe));
        console.log(removeRecipe);
      }
    } else {
      localStorage
        .setItem('favoriteRecipes', JSON.stringify([favoriteRecipe]));
    }
    checkFavorite();
  };
  // pega a receita gerada pela api
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
      // ao entrar na pagina ele marca o botão favorite de uma receita que ja tenha sido favoritada
      if (localStorage.getItem('favoriteRecipes') !== null) {
        const favorited = JSON.parse(localStorage
          .getItem('favoriteRecipes') || '[]') as FavoriteType[];
        const yesOrNo = favorited
          .some((e) => e.id === (data?.idDrink || data?.idMeal));
        setHearteMark(yesOrNo);
      }
    };

    getRecipe();
  }, []);
  // pega 6 das recomendações geradas pela api
  useEffect(() => {
    const getRecommendation = async () => {
      const data = await ServiceFood(scope).recommendation() as unknown as RecommType;
      localStorage
        .setItem('f', JSON.stringify(data));
      if (scope === 'meals') setRecomm(data.drinks.filter((e, i) => i < 6));
      else setRecomm(data.meals.filter((e, i) => i < 6));
    };
    getRecommendation();
  }, []);

  const START_RECIPE = 'Start Recipe';
  const CONTINUE_RECIPE = 'Continue Recipe';
  // muda o texto do botão de start recipe de acordo com o localStorage
  const changStateRecipe = async (progress: any) => {
    if (scope === 'meals') {
      const { meals } = progress;
      if (Object.keys(meals).some((e) => e === recipeId)) {
        setStateRecipe(CONTINUE_RECIPE);
      } else { setStateRecipe(START_RECIPE); }
    }
    if (scope === 'drinks') {
      const { drinks } = progress;
      if (Object.keys(drinks).some((e) => e === recipeId)) {
        setStateRecipe(CONTINUE_RECIPE);
      } else { setStateRecipe(START_RECIPE); }
    }
  };

  useEffect(() => {
    const getStateRecipe = async () => {
      if (localStorage.getItem('inProgressRecipes') !== null) {
        const progress = JSON.parse(localStorage.getItem('inProgressRecipes') || '{}');
        changStateRecipe(progress);
      }
    };
    getStateRecipe();
  }, []);
  // define a responsividade do Carousel
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
          onClick={ handleStartRecipe }
          data-testid="start-recipe-btn"
        >
          { stateRecipe === '' ? START_RECIPE : stateRecipe}
        </button>
      </div>
    </>
  );
}

export default RecipeDetails;
