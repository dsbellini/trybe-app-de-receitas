import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importe o Link
import { fetchApi } from '../../utils/fetchApi';
import { DrinkRecipe, DataDrink, DataCategory } from '../../types';
import Loading from '../LoadingPage/Loading';

const URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const categoryURL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

function PrincipalDrinkPage() {
  const [loading, setLoading] = useState(true);
  const [drink, setDrink] = useState<DrinkRecipe[]>([]);
  const [category, setCategory] = useState<DataCategory[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const isDrinkPage = true;

  const fetchDrink = async () => {
    const responseCategory = await fetchApi(categoryURL);
    const response = await fetchApi(URL) as DataDrink;

    setDrink(response.drinks);
    setCategory(responseCategory.drinks);

    setLoading(false);
  };

  const handleCategoryFilter = async (selectedCategory: string) => {
    let apiUrl = isDrinkPage ? URL : '';

    if (!filterActive && selectedCategory !== '') {
      apiUrl = isDrinkPage
        ? `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
        : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
    }

    const response = await fetchApi(apiUrl) as DataDrink;
    setDrink(response.drinks);
    setFilterActive(!filterActive);
  };

  useEffect(() => {
    fetchDrink();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>{isDrinkPage ? 'Receitas de bebidas' : 'Receitas de comidas'}</h1>

      <nav>
        {category.map((item, index) => (
          index < 5 && (
            <button
              key={ index }
              value={ item.strCategory }
              onClick={ () => handleCategoryFilter(item.strCategory) }
              data-testid={ `${item.strCategory}-category-filter` }
            >
              {item.strCategory}
            </button>
          )
        ))}

        <button
          onClick={ () => handleCategoryFilter('') }
          data-testid="All-category-filter"
        >
          {' '}
          {filterActive ? 'All' : 'Limpar Filtro'}
        </button>
      </nav>

      {drink.map((item, index) => (
        index < 12 && (
          <Link
            to={ `/drinks/${item.idDrink}` }
            key={ item.idDrink }
          >
            <div data-testid={ `${index}-recipe-card` }>
              <img
                src={ item.strDrinkThumb }
                alt={ item.strDrink }
                data-testid={ `${index}-card-img` }
              />
              <h2 data-testid={ `${index}-card-name` }>{item.strDrink}</h2>
            </div>
          </Link>
        )
      ))}
    </div>
  );
}

export default PrincipalDrinkPage;
