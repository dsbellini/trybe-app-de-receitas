import { act, screen } from '@testing-library/react';
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

const URL_FAVORITES = '/favorite-recipes';

const testFavorite = 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg';
const heartBlack = '/src/images/blackHeartIcon.svg';

const recipesTest = [{
  alcoholicOrNot: '',
  category: 'Side',
  id: '53060',
  image: testFavorite,
  name: 'Burek',
  nationality: 'Croatian',
  type: 'meal',
},
{ alcoholicOrNot: 'Alcoholic',
  category: 'Cocktail',
  id: '17225',
  image: 'https://www.thecocktaildb.com/images/media/drink/l3cd7f1504818306.jpg',
  name: 'Ace',
  nationality: '',
  type: 'drink' }];

describe('Testa a página de Favoritos', () => {
  test('Verifica se os itens estão na tela', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipesTest));
    await act(async () => {
      renderWithRouter(<App />, { route: URL_FAVORITES });
    });

    for (let index = 0; index < recipesTest.length; index++) {
      const name = screen.getByTestId(`${index}-horizontal-name`);
      const image = screen.getByTestId(`${index}-horizontal-image`);
      const text = screen.getByTestId(`${index}-horizontal-top-text`);
      const share = screen.getByTestId(`${index}-horizontal-share-btn`);
      const favorite = screen.getByTestId(`${index}-horizontal-favorite-btn`);
      expect(name).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(share).toBeInTheDocument();
      expect(favorite).toBeInTheDocument();
    }

    expect(screen.getByTestId(/filter-by-all-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/filter-by-meal-btn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/filter-by-drink-btn/i)).toBeInTheDocument();
  });

  test('Verifica se os filtros funcionam', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipesTest));
    await act(async () => {
      renderWithRouter(<App />, { route: URL_FAVORITES });
    });

    const filterMeal = await screen.getByTestId(/filter-by-meal-btn/i);
    const filterDrink = await screen.getByTestId(/filter-by-drink-btn/i);
    const filterAll = await screen.getByTestId(/filter-by-all-btn/i);

    await userEvent.click(filterDrink);
    expect(screen.getByText(/Ace/i)).toBeInTheDocument();

    await userEvent.click(filterMeal);
    expect(screen.getByText(/Burek/i)).toBeInTheDocument();

    await userEvent.click(filterAll);
    expect(screen.getByText(/Ace/i)).toBeInTheDocument();
    expect(screen.getByText(/Burek/i)).toBeInTheDocument();
  });

  test('Verifica o botão de copiar link', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipesTest));
    await act(async () => {
      renderWithRouter(<App />, { route: URL_FAVORITES });
    });

    const shareMeal = screen.getByTestId(/0-horizontal-share-btn/i);
    const shareDrink = screen.getByTestId(/1-horizontal-share-btn/i);

    await userEvent.click(shareMeal);
    expect(screen.getByText(/Link copied!/i)).toBeInTheDocument();

    await userEvent.click(shareDrink);
    expect(screen.getByText(/Link copied!/i)).toBeInTheDocument();
  });

  test('Verifica o botão de desfavoritar', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipesTest));
    await act(async () => {
      renderWithRouter(<App />, { route: URL_FAVORITES });
    });

    const desfavorite = screen.getByTestId(/0-horizontal-favorite-btn/i);
    expect(desfavorite).toHaveAttribute('src', heartBlack);
    await userEvent.click(desfavorite);
    const favoriteDrink = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favoriteDrink).toEqual([recipesTest[1]]);

    await userEvent.click(desfavorite);
    const favoriteVazio = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favoriteVazio).toEqual([]);
  });

  test('Verifica a mudança de rota ao clicar no nome', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipesTest));
    await act(async () => {
      renderWithRouter(<App />, { route: URL_FAVORITES });
    });

    const nameMeal = screen.getByTestId(/0-horizontal-name/i);
    await userEvent.click(nameMeal);
    expect(window.location.pathname).toEqual('/meals/53060');
  });

  test('Verifica a mudança de rota ao clicar na imagem', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipesTest));
    await act(async () => {
      renderWithRouter(<App />, { route: URL_FAVORITES });
    });

    const nameDrink = screen.getByTestId(/1-horizontal-image/i);
    await userEvent.click(nameDrink);
    expect(window.location.pathname).toEqual('/drinks/17225');
  });
});
