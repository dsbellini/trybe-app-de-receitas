import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import { DoneReciepesType } from '../exportTypes/types';
import Header from './Header/Header';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState<DoneReciepesType[]>([]);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [showMessageIndex, setShowMessageIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedDoneRecipes = localStorage.getItem('doneRecipes');
    // verifica se o localStorage tem alguma receita e coloca no state doneRecipes
    if (storedDoneRecipes !== null) {
      const parsedDoneRecipes: DoneReciepesType[] = JSON.parse(storedDoneRecipes);
      setDoneRecipes(parsedDoneRecipes);
    }
  }, []);

  // Verificando o que está vindo do localStorage
  // useEffect(() => {
  //   console.log(doneRecipes);
  // }, [doneRecipes]);

  // função para colocar a data neste formato 00/00/0000
  function formatDate(oldDateString: string) {
    if (oldDateString.length === 10) {
      return oldDateString;
    }
    const year = oldDateString.slice(0, 4);
    const month = oldDateString.slice(5, 7);
    const day = oldDateString.slice(8, 10);
    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <div>

        <Header pageTitle="Done Recipes" searchIcon={ false } />

        <button
          data-testid="filter-by-all-btn"
          onClick={ () => setFilteredType(null) }
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

      {doneRecipes.map((recipe, index) => (
        <div key={ index }>
          {filteredType === null || filteredType === recipe.type ? (
            <div>

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

              <p data-testid={ `${index}-horizontal-done-date` }>
                {formatDate(recipe.doneDate)}
              </p>

              {recipe.tags
                && Array.isArray(recipe.tags)
                && recipe.tags.slice(0, 2).map((tag, tagIndex) => (
                  <p
                    key={ `${index}-${tagIndex}` }
                    data-testid={ `${index}-${tag}-horizontal-tag` }
                  >
                    {tag}
                  </p>
                ))}

              <button
                src={ shareIcon }
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => {
                  navigator.clipboard.writeText(`http://localhost:3000/${recipe.type}s/${recipe.id}`);
                  setShowMessageIndex(index);
                  setTimeout(() => {
                    setShowMessageIndex(null);
                  }, 2000);
                } }
              >
                <img src={ shareIcon } alt="Share" />
              </button>

              {showMessageIndex === index && <p>Link copied!</p>}

            </div>
          ) : (
            null
          )}
        </div>
      ))}
    </>
  );
}

export default DoneRecipes;
