import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';

describe('Testa a página de Login', () => {
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
