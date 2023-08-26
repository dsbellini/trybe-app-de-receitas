import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import renderWithRouter from './renderWithRouter';
import App from '../App';
import { mockDrink, mockMeal } from './mocks/mockMealsAndDrinks';

const mealsData = { meals: mockMeal.meals };
const drinksData = { drinks: mockDrink.drinks };
const DRINKS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997';
const MEALS_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=53060';

const DEFAULT_MEAL = '/meals/53060/in-progress';
const DEFAULT_DRINK = '/drinks/15997/in-progress';

const favMealRecipe = {
  id: mealsData.meals[0].idMeal,
  nationality: mealsData.meals[0].strArea,
  name: mealsData.meals[0].strMeal,
  category: mealsData.meals[0].strCategory,
  image: mealsData.meals[0].strMealThumb,
  alcoholicOrNot: '',
  type: 'meal',
  doneDate: '2023-08-23T21:30:00.000Z',
};

const favDrinkRecipe = {
  id: drinksData.drinks[0].idDrink,
  nationality: '',
  name: drinksData.drinks[0].strDrink,
  category: drinksData.drinks[0].strCategory,
  image: drinksData.drinks[0].strDrinkThumb,
  alcoholicOrNot: drinksData.drinks[0].strAlcoholic,
  type: 'drink',
  doneDate: '2023-08-23T22:30:00.000Z',
};

const doneMealRecipe = {
  id: mealsData.meals[0].idMeal,
  nationality: mealsData.meals[0].strArea,
  name: mealsData.meals[0].strMeal,
  category: mealsData.meals[0].strCategory,
  image: mealsData.meals[0].strMealThumb,
  alcoholicOrNot: '',
  type: 'meal',
  doneDate: '2023-08-23T21:30:00.000Z',
};

const doneDrinkRecipe = {
  id: drinksData.drinks[0].idDrink,
  nationality: '',
  name: drinksData.drinks[0].strDrink,
  category: drinksData.drinks[0].strCategory,
  image: drinksData.drinks[0].strDrinkThumb,
  alcoholicOrNot: drinksData.drinks[0].strAlcoholic,
  type: 'drink',
};

describe('Testes da página de Receita em Progresso - Testes de Render', () => {
  beforeEach(() => {
    const fetch = (url: string) => Promise.resolve({
      status: 200,
      ok: true,
      json: () => {
        if (url === MEALS_URL) {
          return Promise.resolve(mealsData);
        }
        if (url === DRINKS_URL) {
          return Promise.resolve(drinksData);
        }
      },
    });

    global.fetch = vi.fn().mockImplementation(fetch);

    afterEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });
  });

  //   Testes de renderização - Linha 84 até 135;

  test('Verifica se a página renderiza a imagem do alimento', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });
    const photo = screen.getByAltText(/Foto da Receita/i);
    expect(photo).toBeInTheDocument();
  });

  test('Verifica se a página renderiza o título do alimento com o nome correto', async () => {
    await act(() => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });
    const title = screen.getByTestId(/recipe-title/i);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(mealsData.meals[0].strMeal);
  });

  test('Verifica se a página renderiza a categoria do alimento', async () => {
    await act(() => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });
    const category = screen.getByTestId(/recipe-category/i);
    expect(category).toBeInTheDocument();
    expect(category).toHaveTextContent(mealsData.meals[0].strCategory);
  });

  test('Verifica se a página renderiza as instruções do alimento', async () => {
    await act(() => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });
    const instructions = screen.getByTestId(/instructions/i);
    expect(instructions).toBeInTheDocument();
    expect(instructions).toHaveTextContent(mealsData.meals[0].strInstructions);
  });

  test('Verifica a presença dos botões de compartilhar, favoritar e finalizar', async () => {
    renderWithRouter(<App />, { route: DEFAULT_MEAL });

    const shareBtn = screen.getByTestId(/share-btn/i);
    const favBtn = screen.getByTestId(/favorite-btn/i);
    const finishBtn = screen.getByTestId(/finish-recipe-btn/i);
    expect(shareBtn).toBeInTheDocument();
    expect(favBtn).toBeInTheDocument();
    expect(finishBtn).toBeInTheDocument();
  });
  test('Verifica a presença dos ingredientes', async () => {
    await act(() => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
    });
    const ingredients = screen.getByTestId(/ingredients/i);
    expect(ingredients).toBeInTheDocument();
    expect(ingredients).toHaveTextContent(mealsData.meals[0].strIngredient1);
    expect(ingredients).toHaveTextContent(mealsData.meals[0].strIngredient2);
  });

  // Testes de funções - Linha 139 até 259;

  describe('Testes da página de Receita em Progresso - Testes de Funções', () => {
    test('Verifica se o botão de favoritar funciona', async () => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });
      const favBtn = screen.getByTestId(/favorite-btn/i);

      expect(favBtn).toHaveAttribute('src', '/src/images/whiteHeartIcon.svg');
      await userEvent.click(favBtn);
      expect(favBtn).toHaveAttribute('src', '/src/images/blackHeartIcon.svg');
    });

    test('Verifica se, ao clicar no botão de favorito, adiciona o alimento no localStorage', async () => {
      localStorage.setItem('favRecipes', JSON.stringify(favMealRecipe));
      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_MEAL });
      });
      const favBtn = screen.getByTestId(/favorite-btn/i);
      await userEvent.click(favBtn);
      expect(localStorage.getItem('favRecipes')).toBe(JSON.stringify(favMealRecipe));
    });

    test('Verifica se, ao clicar novamente no botão de favorito, remove o alimento no localStorage', async () => {
      localStorage.setItem('favRecipes', JSON.stringify(favMealRecipe));
      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_MEAL });
      });
      const favBtn = screen.getByTestId(/favorite-btn/i);
      await userEvent.click(favBtn);
      await localStorage.removeItem('favRecipes');
      expect(window.localStorage.getItem('favRecipes')).toBeNull();
    });

    test('Verifica se, ao clicar no botão de favorito, adiciona a bebida no localStorage', async () => {
      localStorage.setItem('favRecipes', JSON.stringify(favDrinkRecipe));
      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_DRINK });
      });
      const favBtn = screen.getByTestId(/favorite-btn/i);
      await userEvent.click(favBtn);
      expect(localStorage.getItem('favRecipes')).toBe(JSON.stringify(favDrinkRecipe));
    });

    test('Verifica se, ao clicar novamente no botão de favorito, remove a bebida no localStorage', async () => {
      localStorage.setItem('favRecipes', JSON.stringify(favDrinkRecipe));
      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_DRINK });
      });
      const favBtn = screen.getByTestId(/favorite-btn/i);
      await userEvent.click(favBtn);
      await localStorage.removeItem('favRecipes');
      expect(window.localStorage.getItem('favRecipes')).toBeNull();
    });

    test('Verifica se ao clicar em um ingrediente, é adicionado no localStorage', async () => {
      localStorage.setItem('inProgressRecipesTest', JSON.stringify({ meals: { 53060: [true] } }));

      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_MEAL });
      });
      const ingredient = screen.getByTestId(/0-ingredient-step/i);
      await userEvent.click(ingredient);
      expect(localStorage.getItem('inProgressRecipesTest')).toBe(JSON.stringify({ meals: { 53060: [true] } }));
    });

    test('Verifica se ao clicar em um ingrediente de bebida, é adicionado no localStorage', async () => {
      localStorage.setItem('inProgressRecipesTest', JSON.stringify({ drinks: { 15997: [true] } }));

      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_DRINK });
      });
      const ingredient = screen.getByTestId(/0-ingredient-step/i);
      await userEvent.click(ingredient);
      expect(localStorage.getItem('inProgressRecipesTest')).toBe(JSON.stringify({ drinks: { 15997: [true] } }));
    });

    test('Verifica se, ao clicar no botão de finalizar, adiciona o meal no localStorage', async () => {
      localStorage.setItem('doneRecipesTest', JSON.stringify(doneMealRecipe));
      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_MEAL });
      });
      const finishBtn = screen.getByTestId(/finish-recipe-btn/i);
      await userEvent.click(finishBtn);
      expect(localStorage.getItem('doneRecipesTest')).toBe(JSON.stringify(doneMealRecipe));
    });

    test('Verifica se, ao clicar no botão de finalizar, adiciona o drink no localStorage', async () => {
      localStorage.setItem('doneRecipesTest', JSON.stringify(doneDrinkRecipe));
      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_DRINK });
      });
      const finishBtn = screen.getByTestId(/finish-recipe-btn/i);
      await userEvent.click(finishBtn);
      console.log(localStorage.getItem('doneRecipesTest'));
      expect(localStorage.getItem('doneRecipesTest')).toBe(JSON.stringify(doneDrinkRecipe));
    });

    test('Verifica se o botão de copir link mostra a mensagem "Link copied!"', async () => {
      renderWithRouter(<App />, { route: DEFAULT_MEAL });

      const btnShare = screen.getByTestId('share-btn');
      await userEvent.click(btnShare);
      const copy = screen.getByText('Link copied!');
      expect(copy).toBeInTheDocument();
    });

    test('Redireciona a página para Done Recipes após clicar em Finalizar', async () => {
      localStorage.setItem('inProgressRecipesTest', JSON.stringify({ meals: { 53060: [true] } }));

      await act(() => {
        renderWithRouter(<App />, { route: DEFAULT_MEAL });
      });

      const finishBtn = screen.getByTestId(/finish-recipe-btn/i);

      expect(localStorage.getItem('inProgressRecipesTest')).toMatchObject(JSON.stringify({ meals: { 53060: [true] } }));

      await waitFor(() => expect(finishBtn).toBeEnabled());
      await userEvent.click(finishBtn);
      expect(window.location.pathname).toBe('/done-recipes');
    });
  });
});
