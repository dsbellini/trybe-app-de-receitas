import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importe o Link
import { Button, Card, Container } from 'react-bootstrap';
import { fetchApi } from '../../utils/fetchApi';
import { DrinkRecipe, DataDrink, DataCategory } from '../../types';
import Loading from '../LoadingPage/Loading';
import './styles.css';

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

      {drink.map((item, index) => (
        index < 12 && (
          <Link to={ `/drinks/${item.idDrink}` } key={ item.idDrink }>
            <Container className="card-container">
              <Card className="card">
                <Card.Img
                  src={ item.strDrinkThumb }
                  alt={ item.strDrink }
                  data-testid={ `${index}-card-img` }
                  className="card-img"
                />
                <Card.Body>
                  <Card.Title data-testid={ `${index}-card-name` }>
                    {item.strDrink}
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

export default PrincipalDrinkPage;
