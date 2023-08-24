import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import Profile from '../components/Profile';
import App from '../App';

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

  test('Verifica se o localStorage é limpo ao clicar em logout', async () => {
    renderWithRouter(<App />, { route: '/profile' });
    const logoutBtn = screen.getByTestId(/profile-logout-btn/i);
    expect(logoutBtn).toBeInTheDocument();
    await userEvent.click(logoutBtn);
    // expect(localStorage.clear);
    const email = screen.getByTestId(/email-input/i);
    const senha = screen.getByTestId(/password-input/i);
    const botao = screen.getByTestId(/login-submit-btn/i);
    expect(email).toBeInTheDocument();
    expect(senha).toBeInTheDocument();
    expect(botao).toBeInTheDocument();
  });

  test('Verifica se o email inserido no login é renderizado na tela', async () => {
    renderWithRouter(<App />, { route: '/' });
    const email = screen.getByTestId(/email-input/i);
    const senha = screen.getByTestId(/password-input/i);
    const botao = screen.getByTestId(/login-submit-btn/i);

    expect(botao).toBeDisabled();
    await userEvent.type(email, 'email@email.com');
    await userEvent.type(senha, '1234567');
    expect(botao).toBeEnabled();
    await userEvent.click(botao);
    const profileButton = screen.getByTestId(/profile-top-btn/i);
    expect(profileButton).toBeInTheDocument();
    await userEvent.click(profileButton);
    const profileEmail = screen.getByTestId(/profile-email/i);
    expect(profileEmail).toContainHTML('email@email.com');
  });
});
