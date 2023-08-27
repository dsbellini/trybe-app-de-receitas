import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import { FavoriteType } from '../../exportTypes/types';
import shareIcon from '../../images/shareIcon.svg';
import blackHeart from '../../images/blackHeartIcon.svg';

function FavoriteRecipes() {
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);
  const [filteredType, setFilteredType] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyLink = (recipe: FavoriteType) => {
    const baseUrl = window.location.origin;
    const recipeLink = `${baseUrl}/${recipe.type}s/${recipe.id}`;

    navigator.clipboard.writeText(recipeLink).then(() => {
      setCopySuccess(recipe.id);
      setTimeout(() => setCopySuccess(''), 1500);
    });
  };

  const handleFavorite = (recipe: FavoriteType) => {
    if (localStorage.getItem('favoriteRecipes') !== null) {
      const removeRecipe = favorites
        .filter((e) => e.id !== (recipe.id)) as FavoriteType[];
      localStorage
        .setItem('favoriteRecipes', JSON.stringify(removeRecipe));
      setFavorites(removeRecipe);
    }
  };

  useEffect(() => {
    const getFavorite = () => {
      const favorited = JSON.parse(localStorage
        .getItem('favoriteRecipes') || '[]') as FavoriteType[];
      setFavorites(favorited);
    };
    getFavorite();
  }, []);

  return (
    <>

      <div>
        <Header
          pageTitle="Favorite Recipes"
          searchIcon={ false }
        />

        <button
          data-testid="filter-by-all-btn"
          onClick={ () => setFilteredType('') }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => setFilteredType('meal') }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => setFilteredType('drink') }
        >
          Drinks
        </button>
      </div>

      {favorites.filter((e) => {
        if (filteredType === 'meal') {
          return e.type === 'meal';
        }
        if (filteredType === 'drink') {
          return e.type === 'drink';
        }
        return true;
      })
        .map((recipe, index) => (
          <div key={ index }>
            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
            </Link>

            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <img
                data-testid={ `${index}-horizontal-image` }
                alt={ recipe.name }
                src={ recipe.image }
              />
            </Link>

            <p data-testid={ `${index}-horizontal-top-text` }>
              {recipe.type === 'meal'
                ? `${recipe.nationality} - ${recipe.category}`
                : `${recipe.alcoholicOrNot}`}
            </p>

            <div>
              { copySuccess === recipe.id ? <p>Link copied!</p> : null }
              <button onClick={ () => handleCopyLink(recipe) }>
                <img
                  src={ shareIcon }
                  alt="Share"
                  data-testid={ `${index}-horizontal-share-btn` }
                />
              </button>
              <button onClick={ () => handleFavorite(recipe) }>
                <img
                  src={ blackHeart }
                  alt="black"
                  data-testid={ `${index}-horizontal-favorite-btn` }
                />
              </button>
            </div>
          </div>
        ))}
    </>
  );
}

export default FavoriteRecipes;
