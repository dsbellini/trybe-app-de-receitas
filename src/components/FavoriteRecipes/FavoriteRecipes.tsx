import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import { FavoriteType } from '../../exportTypes/types';
import shareIcon from '../../images/shareIcon.svg';
import blackHeart from '../../images/blackHeartIcon.svg';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import style from './FavoriteRecipes.module.css';

function FavoriteRecipes() {
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);
  const [filteredType, setFilteredType] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = (recipe: FavoriteType) => {
    const baseUrl = window.location.origin;
    const recipeLink = `${baseUrl}/${recipe.type}s/${recipe.id}`;

    navigator.clipboard.writeText(recipeLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
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
    <div>
        <Header
          pageTitle="Favorite Recipes"
          searchIcon={ false }
        />
      <ButtonGroup className={ style.buttons }>
        <Button
          variant="success" 
          data-testid="filter-by-all-btn"
          onClick={ () => setFilteredType('') }
        >
          All
        </Button >
        <Button 
          variant="success"
          data-testid="filter-by-meal-btn"
          onClick={ () => setFilteredType('meal') }
        >
          Meals
        </Button >
        <Button 
          variant="success"
          data-testid="filter-by-drink-btn"
          onClick={ () => setFilteredType('drink') }
        >
          Drinks
        </Button >
      </ButtonGroup >

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
          <Container className={ style.iten }>
            <Row className='row' key={ index }>
              <Col>  
                <Link to={ `/${recipe.type}s/${recipe.id}` }>
                  <Image
                    className={ style.image }
                    data-testid={ `${index}-horizontal-image` }
                    alt={ recipe.name }
                    src={ recipe.image }
                  />
                </Link>
              </Col>

              <Col>
                <Link to={ `/${recipe.type}s/${recipe.id}` }>
                  <p className={ style.name } data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
                </Link>

                <p className={ style.type } data-testid={ `${index}-horizontal-top-text` }>
                  {recipe.type === 'meal'
                    ? `${recipe.nationality} - ${recipe.category}`
                    : `${recipe.alcoholicOrNot}`}
                </p>
                  <ButtonGroup>
                    <Button variant="light" onClick={ () => handleCopyLink(recipe) }>
                      <Image
                        src={ shareIcon }
                        alt="Share"
                        data-testid={ `${index}-horizontal-share-btn` }
                      />
                    </Button>
                    <Button variant="light" onClick={ () => handleFavorite(recipe) }>
                      <Image
                        src={ blackHeart }
                        alt="black"
                        data-testid={ `${index}-horizontal-favorite-btn` }
                      />
                    </Button>
                  </ButtonGroup>
              </Col>
            </Row>
          </Container>

        ))}
      { copySuccess === true 
          ?( 
              <Button 
                variant="light"
                className={ style.copy }
                >
                  Link copied!
              </Button>) : null }
    </div>
  );
}

export default FavoriteRecipes;
