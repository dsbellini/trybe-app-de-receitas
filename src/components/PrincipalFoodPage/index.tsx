import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // teste de import
import { fetchApi } from '../../utils/fetchApi';
import { MealRecipe, DataMeal, DataCategory } from '../../types';

const URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const categoryURL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

function PrincipalFoodPage() {
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState<MealRecipe[]>([]);
  const [category, setCategory] = useState<DataCategory[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const isDrinkPage = false;

  const fetchFood = async () => {
    const responseCategory = await fetchApi(categoryURL);
    const responseFood = await fetchApi(URL) as DataMeal;

    setCategory(responseCategory.meals);
    setFood(responseFood.meals);

    setLoading(false);
  };

  const handleCategoryFilter = async (selectedCategory: string) => {
    let apiUrl = isDrinkPage ? '' : URL;

    if (!filterActive && selectedCategory !== '') {
      apiUrl = isDrinkPage
        ? `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
        : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
    }

    const response = await fetchApi(apiUrl) as DataMeal;
    setFood(response.meals);
    setFilterActive(!filterActive);
  };

  useEffect(() => {
    fetchFood();
  }, []);

  if (loading) return <div>Loading...</div>;

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
          {filterActive ? 'All' : 'Limpar Filtro'}
        </button>
      </nav>

      {food.map((item, index) => (
        index <= 12 && (
          <Link
            to={ `/meals/${item.idMeal}` }
            key={ item.idMeal }
          >
            <div data-testid={ `${index}-recipe-card` }>
              <img
                src={ item.strMealThumb }
                alt={ item.strMeal }
                data-testid={ `${index}-card-img` }
              />
              <h2 data-testid={ `${index}-card-name` }>{item.strMeal}</h2>
            </div>
          </Link>
        )
      ))}
    </div>
  );
}

export default PrincipalFoodPage;
