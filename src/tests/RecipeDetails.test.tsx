import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import renderWithRouter from './renderWithRouter';
import Profile from '../components/Profile';
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
beforeEach(() => {
  const fetchTest = (url: string) => Promise.resolve({
    status: 200,
    ok: true,
    json: () => {
      console.log('>>>>>>>>>>>>>>>>>>>>', url);
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

  global.fetch = vi.fn().mockImplementation(fetchTest);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Testa a página de Perfil', () => {
  test('Verifica a chamada da api de receita de comida', () => {
    renderWithRouter(<App />, { route: '/meals/53060' });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('Verifica a chamada da api de receita de bebida', () => {
    renderWithRouter(<App />, { route: '/drinks/15997' });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('Verifica os itens na tela', async () => {
    renderWithRouter(<App />, { route: '/meals/53060' });

    expect(screen.getByTestId(/recipe-title/i)).toBeInTheDocument();
    expect(screen.getByTestId(/recipe-category/i)).toBeInTheDocument();
    expect(screen.getByTestId(/share-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/favorite-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/instructions/i)).toBeInTheDocument();
    expect(screen.getByTestId(/start-recipe-btn/i)).toBeInTheDocument();
  });
});
