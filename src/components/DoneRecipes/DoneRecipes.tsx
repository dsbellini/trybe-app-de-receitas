import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import share2 from '../../images/shareIcon.svg';
import style from './DoneRecipes.module.css';
import { DoneReciepesType } from '../../exportTypes/types';
import Header from '../Header/Header';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState<DoneReciepesType[]>([]);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [showMessageIndex, setShowMessageIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedDoneRecipes = localStorage.getItem('doneRecipes');

    if (storedDoneRecipes !== null) {
      const parsedDoneRecipes: DoneReciepesType[] = JSON.parse(storedDoneRecipes);
      setDoneRecipes(parsedDoneRecipes);
    }
  }, []);

  const filteredRecipes = filteredType
    ? doneRecipes.filter((recipe) => recipe.type === filteredType)
    : doneRecipes;

  const handleShare = (text: DoneReciepesType, index: number) => {
    navigator.clipboard.writeText(`http://localhost:3000/${text.type}s/${text.id}`);
    setShowMessageIndex(index);
    setTimeout(() => {
      setShowMessageIndex(null);
    }, 2000);
  };

  return (
    <>
      <div>
        <Header pageTitle="Done Recipes" searchIcon={ false } />
      </div>
      <div className={ style.btnCategory }>
        <button
          className={ style.btnAll }
          data-testid="filter-by-all-btn"
          onClick={ () => setFilteredType(null) }
        >
          All
        </button>
        <button
          className={ style.btnMeals }
          data-testid="filter-by-meal-btn"
          onClick={ () => setFilteredType('meal') }
        >
          Meals
        </button>
        <button
          className={ style.btnDrinks }
          data-testid="filter-by-drink-btn"
          onClick={ () => setFilteredType('drink') }
        >
          Drinks
        </button>
      </div>

      {filteredRecipes.map((recipe, index) => (
        <Container key={ index } className={ style.item }>
          <Card
            className={ `${style.card} text-white text-center` }
            style={ { width: '20rem' } }
          >
            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <Card.Img
                variant="top"
                src={ recipe.image }
                data-testid={ `${index}-horizontal-image` }
                alt="Recipe"
              />
            </Link>
            <Card.Body>
              <Card.Title>
                <Link
                  data-testid={ `${index}-horizontal-name` }
                  to={ `/${recipe.type}s/${recipe.id}` }
                >
                  {recipe.name}
                </Link>
              </Card.Title>
              <Card.Text data-testid={ `${index}-horizontal-top-text` }>
                {recipe.type === 'meal'
                  ? `${recipe.nationality} - ${recipe.category}`
                  : `${recipe.alcoholicOrNot}`}
              </Card.Text>
              <Card.Text data-testid={ `${index}-horizontal-done-date` }>
                {recipe.doneDate}
              </Card.Text>
              <div className={ style.Tags }>
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
              </div>
              <Button
                className={ style.btnShare }
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => handleShare(recipe, index) }
                variant="light"
              >
                <img className={ style.imgShare } src={ share2 } alt="Share" />
              </Button>
              <div className={ style.copy }>
                {showMessageIndex === index && (
                  <Alert variant="success">Link copied!</Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Container>
      ))}
    </>
  );
}

export default DoneRecipes;
