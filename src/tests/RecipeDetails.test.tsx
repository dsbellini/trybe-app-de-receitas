import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import renderWithRouter from './renderWithRouter';
import App from '../App';
import { mockMeal, mockDrink } from './mocks/mockMealsAndDrinks';
import { recomMeals } from './mocks/mockRecomMeal';
import { recomDrinks } from './mocks/mockRecomDrink';

const mealsData = { meals: mockMeal.meals };
const drinksData = { drinks: mockDrink.drinks };
const RECOMMENDATION_DRINK_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const RECOMMENDATION_MEAL_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const DRINKS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997';
const MEALS_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=53060';

const DEFAULT_MEAL = '/meals/53060';
const DEFAULT_DRINK = '/drinks/15997';

const testFavorite = 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg';
const heartWhite = '/src/images/whiteHeartIcon.svg';
const heartBlack = '/src/images/blackHeartIcon.svg';
const startRecipeBtn = 'start-recipe-btn';

beforeEach(() => {
  const fetch = (url: string) => Promise.resolve({
    status: 200,
    ok: true,
    json: () => {
      // console.log('>>>>>>>>>>>>>>>>>>>>', url);
      if (url === MEALS_URL) {
        return Promise.resolve(mealsData);
      }
      if (url === DRINKS_URL) {
        return Promise.resolve(drinksData);
      }
      if (url === RECOMMENDATION_DRINK_URL) {
        return Promise.resolve(recomDrinks);
      }
      if (url === RECOMMENDATION_MEAL_URL) {
        return Promise.resolve(recomMeals);
      }
    },
  });

  global.fetch = vi.fn().mockImplementation(fetch);
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('Testa a página de Detalhes da receita', () => {
  test('Verifica a chamada da api de receita de comida', () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('Verifica a chamada da api de receita de bebida', () => {
    renderWithRouter(<App />, { route: DEFAULT_DRINK });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('Verifica os itens na tela de comida', async () => {
    await act(async () => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });
    for (let i = 0; i < 6; i++) {
      const ingredientId = screen.getByTestId(`${i}-ingredient-name-and-measure`);
      expect(ingredientId).toBeInTheDocument();
    }

    expect(screen.getByTestId(/video/i)).toBeInTheDocument();
    expect(screen.getByTestId(/recipe-title/i)).toBeInTheDocument();
    expect(screen.getByTestId(/recipe-category/i)).toBeInTheDocument();
    expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/favorite-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/instructions/i)).toBeInTheDocument();
    expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
  });

  test('Verifica os itens na tela de bebida', async () => {
    await act(async () => {
      renderWithRouter(<App />, { route: DEFAULT_DRINK });
    });
    for (let i = 0; i < 3; i++) {
      const ingredientId = screen.getByTestId(`${i}-ingredient-name-and-measure`);
      expect(ingredientId).toBeInTheDocument();
    }

    expect(screen.getByTestId(/recipe-title/i)).toBeInTheDocument();
    expect(screen.getByTestId(/recipe-category/i)).toBeInTheDocument();
    expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/favorite-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/instructions/i)).toBeInTheDocument();
    expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
  });

  it('Verifica se o botão de favoritar funciona', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });
    const favorite = await screen.getByTestId(/favorite-btn/i);

    expect(favorite).toHaveAttribute('src', heartWhite);
    await userEvent.click(favorite);
    expect(favorite).toHaveAttribute('src', heartBlack);
  });

  it('Verifica se o texto do botão "Start Recipe" muda para "Continue Recipe" em comida', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      meals: {
        53060: [true],
      },
      drinks: {},
    }));
    renderWithRouter(<App />, { route: DEFAULT_MEAL });
    const btnRecipe = screen.getByTestId(startRecipeBtn);
    expect(btnRecipe).toBeInTheDocument();
    expect(btnRecipe).toHaveTextContent('Continue Recipe');
  });

  it('Verifica se o texto do botão "Start Recipe" muda para "Continue Recipe" em bebida', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      meals: {},
      drinks: {
        15997: [true],
      },
    }));
    renderWithRouter(<App />, { route: DEFAULT_DRINK });
    const btnRecipe = screen.getByTestId(startRecipeBtn);
    expect(btnRecipe).toBeInTheDocument();
    expect(btnRecipe).toHaveTextContent('Continue Recipe');
  });

  it('Verifica se o botão favorite vem preenchido caso já esteja favoritado', async () => {
    const recipeTest = [{
      alcoholicOrNot: '',
      category: 'Side',
      id: '53060',
      image: testFavorite,
      name: 'Burek',
      nationality: 'Croatian',
      type: 'meal',
    }];
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipeTest));

    await act(async () => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });

    const favorite = await screen.getByTestId(/favorite-btn/i);
    expect(favorite).toHaveAttribute('src', heartBlack);
    await userEvent.click(favorite);

    const favoriteVasio = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favoriteVasio).toEqual([]);
    expect(favorite).toHaveAttribute('src', heartWhite);
  });

  it('Verifica se é adicionado mais de um favorito', async () => {
    const feckRecipeTest = [{
      alcoholicOrNot: '',
      category: 'Side',
      id: '11111',
      image: testFavorite,
      name: 'Burek',
      nationality: 'Croatian',
      type: 'meal',
    }];
    const currentRecipeTest = {
      alcoholicOrNot: '',
      category: 'Side',
      id: '53060',
      image: testFavorite,
      name: 'Burek',
      nationality: 'Croatian',
      type: 'meal',
    };
    localStorage.setItem('favoriteRecipes', JSON.stringify(feckRecipeTest));

    await act(async () => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });

    const favorite = await screen.getByTestId(/favorite-btn/i);
    expect(favorite).toHaveAttribute('src', heartWhite);
    await userEvent.click(favorite);

    const favoriteVasio = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favoriteVasio).toEqual([...feckRecipeTest, currentRecipeTest]);
    expect(favorite).toHaveAttribute('src', heartBlack);
  });

  it('Verifica se o botão de copir link mostra a mensagem "Link copied!"', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });

    const btnShare = screen.getByTestId('share-btn');
    await userEvent.click(btnShare);
    const copy = screen.getByText('Link copied!');
    expect(copy).toBeInTheDocument();
  });

  it('Verifica se muda de rota ao clicar no botão "Start Recipe" em comida', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });

    const btnStart = screen.getByTestId(startRecipeBtn);
    await userEvent.click(btnStart);
    expect(window.location.pathname).toEqual('/meals/53060/in-progress');
  });

  it('Verifica se muda de rota ao clicar no botão "Start Recipe em bebida', async () => {
    renderWithRouter(<App />, { route: DEFAULT_DRINK });

    const btnStart = screen.getByTestId(startRecipeBtn);
    await userEvent.click(btnStart);
    expect(window.location.pathname).toEqual('/drinks/15997/in-progress');
  });

  it('Verifica se o botão de copir link mostra a mensagem "Link copied!"', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });

    const btnShare = screen.getByTestId('share-btn');
    await userEvent.click(btnShare);
    const copy = screen.getByText('Link copied!');
    expect(copy).toBeInTheDocument();
  });
  it('Verifica se muda de rota ao clicar no botão "Start Recipe"', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });

    const btnStart = screen.getByTestId('start-recipe-btn');
    await userEvent.click(btnStart);
    expect(window.location.pathname).toEqual('/meals/53060/in-progress');
  });
});
