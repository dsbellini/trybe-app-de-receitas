import { screen } from '@testing-library/react';
import renderWithRouter from './renderWithRouter';
import Profile from '../components/Profile';

describe('Testa a página de Perfil', () => {
  test('Verifica se a página renderiza os botões corretos', () => {
    renderWithRouter(<Profile />);
    const doneRecipesBtn = screen.getByTestId(/profile-done-btn/i);
    const favRecipesBtn = screen.getByTestId(/profile-favorite-btn/i);
    const logoutBtn = screen.getByTestId(/profile-logout-btn/i);
    expect(doneRecipesBtn).toBeInTheDocument();
    expect(favRecipesBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });
});
