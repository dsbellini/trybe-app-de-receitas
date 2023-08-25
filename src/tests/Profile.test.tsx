import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import renderWithRouter from './renderWithRouter';
import Profile from '../components/Profile';
import App from '../App';
import { mockMeal } from './mocks/mockMealsAndDrinks';

const userData = {
  user: {
    email: 'email@teste.com',
  },
};

describe('Testa a página de Perfil', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ meals: mockMeal.meals }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('Verifica se a página renderiza os botões corretos', () => {
    renderWithRouter(<Profile />);
    const doneRecipesBtn = screen.getByTestId(/profile-done-btn/i);
    const favRecipesBtn = screen.getByTestId(/profile-favorite-btn/i);
    const logoutBtn = screen.getByTestId(/profile-logout-btn/i);
    expect(doneRecipesBtn).toBeInTheDocument();
    expect(favRecipesBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });

  test('Verifica se o localStorage é limpo ao clicar em logout', async () => {
    localStorage.setItem('userData', JSON.stringify(userData));

    renderWithRouter(<App />, { route: '/profile' });
    const logoutBtn = screen.getByTestId(/profile-logout-btn/i);
    expect(logoutBtn).toBeInTheDocument();
    await userEvent.click(logoutBtn);
    expect(window.localStorage.getItem('userData')).toBeNull();
  });

  test('Verifica se o email inserido no login é renderizado na tela', async () => {
    localStorage.setItem('userData', JSON.stringify(userData));

    renderWithRouter(<App />, { route: '/profile' });
    expect(window.localStorage.getItem('userData')).toBe(JSON.stringify(userData));
  });

  test('Verifica se a página é redirecionada após clicar no botão Done Recipes', async () => {
    renderWithRouter(<App />, { route: '/profile' });

    const doneRecipesBtn = screen.getByTestId(/profile-done-btn/i);
    await userEvent.click(doneRecipesBtn);

    expect(window.location.pathname).toBe('/done-recipes');
  });

  test('Verifica se a página é redirecionada após clicar no botão Favorite Recipes', async () => {
    renderWithRouter(<App />, { route: '/profile' });

    const favRecipesBtn = screen.getByTestId(/profile-favorite-btn/i);
    await userEvent.click(favRecipesBtn);

    expect(window.location.pathname).toBe('/favorite-recipes');
  });

  test('Verifica se a página é redirecionada para a tela de Login após o logout', async () => {
    renderWithRouter(<App />, { route: '/profile' });

    const logoutBtn = screen.getByTestId(/profile-logout-btn/i);
    await userEvent.click(logoutBtn);

    expect(window.location.pathname).toBe('/');
  });
});
