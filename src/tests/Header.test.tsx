import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './helper/renderWith';
import App from '../App';

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
