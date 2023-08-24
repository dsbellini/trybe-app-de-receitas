import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from './helper/renderWith';
import App from '../App';
import { mockDrink } from './mocks/mockMealsAndDrinks';

describe('Testes do Header', () => {
  // ESSE MOCK NÃO FUNCIONOU:
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

  // ESSE MOCK FUNCIONOU COM O DRINKS, COM O MEALS NÃO ! ENTÃO DEPENDE DA PÁGINA QUE ESTÁ SENDO TESTADA,
  // AS VEZES FUNCIONA COM UM MOCK, AS VEZES COM OUTRO. (DRINKS OU MEALS)

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
