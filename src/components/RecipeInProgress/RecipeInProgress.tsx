/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { FavoriteType, Revenue, Scope } from '../../exportTypes/types';
import { ServiceFood } from '../../services';

function RecipeInProgress() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState(Array(ingredients.length).fill(false));
  const [disabledButton, setDisabledButton] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [recipe, setRecipe] = useState<Revenue | any>();
  const [ingAndMea, setIngAndMea] = useState<string[]>([]);
  const [heartMark, setHeartMark] = useState(false);
  const nav = useNavigate();
  const paramId = window.location.pathname.split('/')[2];
  const scope = window.location.pathname.split('/')[1] as Scope;

  useEffect(() => {
    const getRecipe = async () => {
      const data = await ServiceFood(scope).getById(paramId);
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
      setIngredients(ingredient);
      if (localStorage.getItem('favoriteRecipes') !== null) {
        const favorited = JSON.parse(localStorage
          .getItem('favoriteRecipes') || '[]') as FavoriteType[];
        const yesOrNo = favorited
          .some((e) => e.id === (data?.idDrink || data?.idMeal));
        setHeartMark(yesOrNo);
      }
    };
    getRecipe();
  }, []);

  // Função para verificar se a receita já está salva no localStorage
  useEffect(() => {
    const inProgressRecipes = JSON
      .parse(localStorage.getItem('inProgressRecipes') || '{}');
    if (inProgressRecipes) {
      const drinksInProgress = inProgressRecipes.drinks || {};
      const mealsInProgress = inProgressRecipes.meals || {};

      const checkedItemsForRecipe = scope === 'drinks'
        ? drinksInProgress[paramId] || []
        : mealsInProgress[paramId] || [];

      setCheckedItems(checkedItemsForRecipe);
    }
  }, []);

  // Comentario de teste

  // Função para chamar a função de desabilitar botão
  useEffect(() => {
    handleDisabledButton();
  }, [checkedItems]);

  const handleClick = (index: any) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);

    const updatedInProgressRecipes = {
      ...JSON.parse(localStorage.getItem('inProgressRecipes') || '{}'),
      [scope]: {
        ...JSON.parse(localStorage.getItem('inProgressRecipes') || '{}')[scope],
        [paramId]: newCheckedItems,
      },
    };

    localStorage.setItem('inProgressRecipes', JSON.stringify(updatedInProgressRecipes));
  };

  const handleDisabledButton = () => {
    const checked = checkedItems.filter((item) => item === true);
    if (checked.length === ingredients.length) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  };

  // Função para copiar o link da receita ao clicar no botão share/compartilhar
  const handleCopyLink = () => {
    const baseUrl = window.location.origin; // Obtém o domínio base do site
    const recipeId = paramId; // Substituir pelo ID da receita atual
    const isMeal = scope === 'meals'; // Substituir pelo valor correto (true para receita de comida, false para bebida)
    const recipeLink = `${baseUrl}/${isMeal ? 'meals' : 'drinks'}/${recipeId}`; // Gerar o link da receita

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
      setHeartMark(yesOrNo);
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
      } else {
        const removeRecipe = favorited
          .filter((e) => e.id !== (recipe?.idDrink || recipe?.idMeal));
        localStorage
          .setItem('favoriteRecipes', JSON.stringify(removeRecipe));
      }
    } else {
      localStorage
        .setItem('favoriteRecipes', JSON.stringify([favoriteRecipe]));
    }
    checkFavorite();
  };

  // Função para finalizar a receita e salvar no localStorage - aguardando a página anterior ficar pronta para finalizar
  const handleFinishClick = () => {
    const date = new Date();
    const doneRecipes = {
      id: recipe?.idDrink || recipe?.idMeal,
      nationality: recipe?.strArea || '',
      name: recipe?.strDrink || recipe?.strMeal,
      category: recipe?.strCategory,
      image: recipe?.strDrinkThumb || recipe?.strMealThumb,
      tags: recipe?.strTags ? recipe?.strTags.split(',') : [],
      alcoholicOrNot: recipe?.strAlcoholic || '',
      type: scope.slice(0, -1),
      doneDate: date,
    };

    const storedDoneRecipes = localStorage.getItem('doneRecipes');
    const existingDoneRecipes = storedDoneRecipes ? JSON.parse(storedDoneRecipes) : [];

    const updatedDoneRecipes = [...existingDoneRecipes, doneRecipes];
    localStorage.setItem('doneRecipes', JSON.stringify(updatedDoneRecipes));

    nav('/done-recipes');
  };

  return (
    <>
      <div>
        <img
          src={ recipe?.strDrinkThumb || recipe?.strMealThumb }
          data-testid="recipe-photo"
          alt="Foto da Receita"
          width="300"
          height="200"
        />
      </div>
      <h1 data-testid="recipe-title">{recipe?.strDrink || recipe?.strMeal}</h1>
      {/* Share Button */}
      <button
        data-testid="share-btn"
        onClick={ handleCopyLink }
      >
        <img src={ shareIcon } alt="share-icon" />

      </button>
      {/* Favorite Button */}
      <button
        onClick={ handleFavorite }
      >
        { heartMark
          ? <img src={ blackHeartIcon } alt="black" data-testid="favorite-btn" />
          : <img src={ whiteHeartIcon } alt="white" data-testid="favorite-btn" />}
      </button>
      <p data-testid="recipe-category">{recipe?.strCategory}</p>
      {copySuccess && <p>Link copied!</p>}
      <div data-testid="instructions">
        <h2>Instructions</h2>
        <p>{recipe?.strInstructions}</p>
      </div>
      <div data-testid="ingredients">
        <h2>Ingredients</h2>
        <ul>
          {ingAndMea.map((ingredient, index) => (
            <li key={ index }>
              <label
                htmlFor={ ingredient }
                className={ `${checkedItems[index] ? 'checked' : 'not-checked'}` }
                data-testid={ `${index}-ingredient-step` }
              >
                <input
                  onChange={ () => handleClick(index) }
                  type="checkbox"
                  name={ `ingredient${index}` }
                  value={ ingredient }
                  id={ ingredient }
                  checked={ checkedItems[index] }
                />
                {ingredient}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button
        data-testid="finish-recipe-btn"
        disabled={ disabledButton }
        onClick={ handleFinishClick }

      >
        Finalizar Receita

      </button>
    </>
  );
}

export default RecipeInProgress;
