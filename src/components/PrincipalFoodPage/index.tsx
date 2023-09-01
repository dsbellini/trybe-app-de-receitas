import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // teste de import
import { Button, Card, Container } from 'react-bootstrap';
import { fetchApi } from '../../utils/fetchApi';
import { MealRecipe, DataMeal, DataCategory } from '../../types';
import Loading from '../LoadingPage/Loading';
import './styles.css';

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

  if (loading) return <Loading />;

  return (
    <div>
      {/* <h1>{isDrinkPage ? 'Receitas de bebidas' : 'Receitas de comidas'}</h1> */}

      <nav className="filter-btns">
        {category.map((item, index) => (
          index < 5 && (
            <Button
              key={ index }
              value={ item.strCategory }
              onClick={ () => handleCategoryFilter(item.strCategory) }
              data-testid={ `${item.strCategory}-category-filter` }
              className="btn-filter"
            >
              {item.strCategory}
            </Button>
          )
        ))}

        <Button
          onClick={ () => handleCategoryFilter('') }
          data-testid="All-category-filter"
          className="btn-filter"

        >
          {filterActive ? 'All' : 'Limpar Filtro'}
        </Button>
      </nav>

      {food.map((item, index) => (
        index < 12 && (
          <Link to={ `/meals/${item.idMeal}` } key={ item.idMeal }>
            <Container className="card-container">
              <Card className="card">
                <Card.Img
                  src={ item.strMealThumb }
                  alt={ item.strMeal }
                  data-testid={ `${index}-card-img` }
                  className="card-img"
                />
                <Card.Body>
                  <Card.Title
                    data-testid={ `${index}-card-name` }
                  >
                    {item.strMeal}

                  </Card.Title>
                </Card.Body>
              </Card>
            </Container>
          </Link>
        )
      ))}
    </div>
  );
}

export default PrincipalFoodPage;
