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

  test('Verifica os itens na tela', async () => {
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

  it('Verifica se o botão de favoritar funciona', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });
    const favorite = await screen.getByTestId(/favorite-btn/i);

    expect(favorite).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');
    await userEvent.click(favorite);
    expect(favorite).toHaveAttribute('src', '/src/images/blackHeartIcon.svg');
  });

  it('Verifica se o texto do botão "Start Recipe" muda para "Continue Recipe" e se vai para próxima rota', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      meals: {
        53060: [true],
      },
      drinks: {},
    }));
    renderWithRouter(<App />, { route: DEFAULT_MEAL });
    const btnRecipe = screen.getByTestId('start-recipe-btn');
    expect(btnRecipe).toBeInTheDocument();
    expect(btnRecipe).toHaveTextContent('Continue Recipe');
  });

  it('Verifica se o botão favorite vem preenchido caso já esteja favoritado', async () => {
    const recipeTest = [{
      alcoholicOrNot: '',
      category: 'Side',
      id: '53060',
      image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
      name: 'Burek',
      nationality: 'Croatian',
      type: 'meal',
    }];
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipeTest));

    await act(async () => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });

    const favorite = await screen.getByTestId(/favorite-btn/i);
    expect(favorite).toHaveAttribute('src', '/src/images/blackHeartIcon.svg');
    await userEvent.click(favorite);

    const favoriteVasio = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favoriteVasio).toEqual([]);
    expect(favorite).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');
  });
});
