import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from './helper/renderWith';
import App from '../App';
import { mockDrink, mockMeal } from './mocks/mockMealsAndDrinks';

const mealsData = { meals: mockMeal.meals };
const drinksData = { drinks: mockDrink.drinks };
const MEALS_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const DRINKS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

describe('Testes do Header', () => {
  // beforeEach(() => {
  //   const fetch = (url: string) => Promise.resolve({
  //     status: 200,
  //     ok: true,
  //     json: () => {
  //       if (url === MEALS_URL) { return Promise.resolve(mealsData.meals); }
  //       if (url === DRINKS_URL) { return Promise.resolve(drinksData.drinks); }
  //     },
  //   });

  //   vi.spyOn(global, 'fetch').mockImplementation(fetch);
  // });

  // beforeEach(() => {
  //   global.fetch = vi.fn().mockResolvedValue({
  //     json: async () => (mealsData.meals),
  //   });
  // });

  // beforeEach(() => {
  //   global.fetch = vi.fn().mockResolvedValue({
  //     json: async () => ({ meals: mockMeal.meals }),
  //   });
  // });

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ drinks: mockDrink.drinks }),
    });
  });

  test('Testar o Header conforme o que foi passado', () => {
    renderWithRouter(<App />, { initialEntries: ['/meals'] });
    expect(screen.getByText('Revenues - Meals')).toBeInTheDocument();
    expect(screen.getByTestId('search-top-btn')).toBeInTheDocument();
  });

  test('quando clicamos no botão perfil a rota atualiza para si mesma', async () => {
    renderWithRouter(<App />, { initialEntries: ['/meals'] });
    const profileButton = screen.getByTestId('profile-top-btn');
    await userEvent.click(profileButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('quando clicamos em pesquisa aparece a barra pesquisa', async () => {
    renderWithRouter(<App />, { initialEntries: ['/meals'] });
    const searchButton = screen.getByTestId('search-top-btn');
    await userEvent.click(searchButton);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
});
