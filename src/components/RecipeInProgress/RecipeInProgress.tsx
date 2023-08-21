/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './styles.css';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeart from '../../images/whiteHeartIcon.svg';
// import blackHeart from '../../images/blackHeartIcon.svg';

const steps = [
  'Misture os ingredientes secos em uma tigela.',
  'Adicione os ingredientes líquidos e mexa bem.',
  'Despeje a massa em uma forma untada.',
  'Asse no forno a 180°C por 30 minutos.',
  'Retire do forno e deixe esfriar antes de servir.',
];

const ingredients = [
  'Farinha de trigo',
  'Açúcar',
  'Ovos',
  'Leite',
  'Fermento em pó',
  'Xablau',
  'Fermento em ps',
  'Fermento em ps',
];

function RecipeInProgress() {
  const [checkedItems, setCheckedItems] = useState(Array(ingredients.length).fill(false));
  const [disabledButton, setDisabledButton] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Função para recuperar o estado dos ingredientes salvos no localStorage
  useEffect(() => {
    const inProgressRecipes = JSON.parse(localStorage
      .getItem('inProgressRecipes') || '[]');
    if (inProgressRecipes) {
      setCheckedItems(inProgressRecipes);
    }
  }, []);

  // Função para chamar a função de desabilitar botão
  useEffect(() => {
    handleDisabledButton();
  }, [checkedItems]);

  const handleClick = (index: any) => {
    const newCheckedItems: boolean[] = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    localStorage.setItem('inProgressRecipes', JSON.stringify(newCheckedItems));
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
    const recipeId = '52771'; // Substituir pelo ID da receita atual
    const isMeal = true; // Substituir pelo valor correto (true para receita de comida, false para bebida)
    const recipeLink = `${baseUrl}/${isMeal ? 'meals' : 'drinks'}/${recipeId}`; // Gerar o link da receita

    navigator.clipboard.writeText(recipeLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000); // Remove a mensagem após 3 segundos
    });
  };

  return (
    <>
      <div>
        <img
          src="caminho-da-imagem.jpg"
          data-testid="recipe-photo"
          alt="Foto da Receita"
        />
      </div>
      <h1 data-testid="recipe-title">Título da Receita</h1>
      {/* Share Button */}
      <button
        data-testid="share-btn"
        onClick={ handleCopyLink }
      >
        <img src={ shareIcon } alt="share-icon" />

      </button>
      {/* Favorite Button */}
      <button
        data-testid="favorite-btn"
      >
        <img src={ whiteHeart } alt="white-heart-icon" />
      </button>
      <p data-testid="recipe-category">Categoria da Receita</p>
      {copySuccess && <p>Link copied!</p>}
      <div data-testid="instructions">
        <h2>Instruções</h2>
        <ul>
          {steps.map((step, index) => (
            <li key={ index }>{step}</li>
          ))}
        </ul>
      </div>
      <div data-testid="ingredients">
        <h2>Ingredientes</h2>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li
              key={ index }
            >
              <label
                data-testid={ `${index}-ingredient-step` }
                htmlFor={ ingredient }
                className={ `${checkedItems[index] ? 'checked' : 'not-checked'}` }
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

      >
        Finalizar Receita

      </button>
    </>
  );
}

export default RecipeInProgress;
