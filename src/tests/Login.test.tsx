import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import renderWithRouter from './renderWithRouter';
import App from '../App';
import { mockDrink } from './mocks/mockMealsAndDrinks';
// import { mockMeal, mockDrink } from './mocks/mockMealsAndDrinks';

describe('Testa a página de Login', () => {
  // ESSE MOCK NÃO FUNCIONOU:
  // beforeEach(() => {
  //   const mockFetch = () => Promise.resolve({
  //     json: () => Promise.resolve({}),
  //   });

  //   // vi.spyOn(global, 'fetch').mockImplementation(mockFetch as any);
  //   global.fetch = mockFetch as any;
  // });

  // afterEach(() => {
  //   vi.clearAllMocks();
  // });

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ drinks: mockDrink.drinks }),
    });
  });

  test('Verifica se a página contém inputs de email, senha e botão de entrar', () => {
    renderWithRouter(<App />, { route: '/' });
    const email = screen.getByTestId(/email-input/i);
    const senha = screen.getByTestId(/password-input/i);
    const botao = screen.getByTestId(/login-submit-btn/i);
    expect(email).toBeInTheDocument();
    expect(senha).toBeInTheDocument();
    expect(botao).toBeInTheDocument();
  });

  test('Verifica se após inserir um email e senha válidos, o botão é habilitado', async () => {
    renderWithRouter(<App />, { route: '/' });
    const email = screen.getByTestId(/email-input/i);
    const senha = screen.getByTestId(/password-input/i);
    const botao = screen.getByTestId(/login-submit-btn/i);

    expect(botao).toBeDisabled();
    await userEvent.type(email, 'email@email.com');
    await userEvent.type(senha, '1234567');
    expect(botao).toBeEnabled();
  });
});

// Mock para os valores retornados pelas APIs
// const mealsData = { meals: mockMeal.meals };
// const drinksData = { drinks: mockDrink.drinks };
// const MEALS_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
// const DRINKS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
// beforeEach(() => {
//   // Mock para a função fetch
//   const fetch = (url: string) => Promise.resolve({
//     status: 200,
//     ok: true,
//     json: () => {
//       if (url === MEALS_URL) {
//         return Promise.resolve({
//           status: 200,
//           ok: true,
//           json: () => Promise.resolve(mealsData),
//         });
//       }
//       if (url === DRINKS_URL) {
//         return Promise.resolve({
//           status: 200,
//           ok: true,
//           json: () => Promise.resolve(drinksData),

//         });
//       }

//       if (url === 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list') {
//         return Promise.resolve({
//           status: 200,
//           ok: true,
//           json: () => Promise.resolve({
//             drinks: [{ strCategory: 'Ordinary Drink' }, {
//               strCategory: 'Cocktail',
//             }],
//           }),
//         });
//       }
//     },
//   });

//   // Mock do fetch global
//   global.fetch = fetch as any;
// });

// afterEach(() => {
//   vi.clearAllMocks();
// });
