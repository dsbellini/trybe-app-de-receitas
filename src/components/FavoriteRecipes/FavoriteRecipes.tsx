import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import { Alert } from 'react-bootstrap';
import blackHeart from '../../images/blackHeartIcon.svg';
import shareIcon from '../../images/shareIcon.svg';
import { FavoriteType } from '../../exportTypes/types';
import Header from '../Header/Header';
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
      <Row>
        <Col>
          <button
            className={ style.btnAll }
            data-testid="filter-by-all-btn"
            onClick={ () => setFilteredType('') }
          >
            All
          </button>
        </Col>
        <Col>
          <button
            className={ style.btnAll }
            data-testid="filter-by-all-btn"
            onClick={ () => setFilteredType('meal') }
          >
            Meals
          </button>
        </Col>
        <Col>
          <button
            className={ style.btnAll }
            data-testid="filter-by-all-btn"
            onClick={ () => setFilteredType('drink') }
          >
            Drinks
          </button>
        </Col>
      </Row>

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
          <Container key={ index } className={ style.item }>
            <Card
              className={ `${style.card} text-white text-center` }
              style={ { width: '20rem' } }
            >
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <Card.Img variant="top" src={ recipe.image } />
              </Link>
              <Card.Body>
                <Card.Title>
                  {recipe.name}
                </Card.Title>
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
              </Card.Body>
              <Card.Footer className="text-muted">
                {' '}
                {recipe.type === 'meal'
                  ? `${recipe.nationality} - ${recipe.category}`
                  : `${recipe.alcoholicOrNot}`}

              </Card.Footer>
            </Card>
          </Container>

        ))}
      { copySuccess === true
        ? (
          <div className={ style.copy }>
            <Alert variant="success">Link copied!</Alert>
          </div>) : null }
    </div>
  );
}

export default FavoriteRecipes;
