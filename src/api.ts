const URL_MEALS = 'https://www.themealdb.com/api/json/v1/1';
const URL_DRINKS = 'https://www.thecocktaildb.com/api/json/v1/1';

export type FetchFunction = () => Promise<Response>;

export function MealsByIngredient(ingredient: string): Promise<Response> {
  const url = `${URL_MEALS}/filter.php?i=${ingredient}`;
  return fetch(url);
}

export function MealsByName(name: string):
Promise<Response> {
  const url = `${URL_MEALS}/search.php?f=${name}`;
  return fetch(url);
}

export function MealsByFirstLetter(letter: string): Promise<Response> {
  const url = `${URL_MEALS}/search.php?f=${letter}`;
  return fetch(url);
}

export function DrinksByIngredient(ingredient: string): Promise<Response> {
  const url = `${URL_DRINKS}/filter.php?i=${ingredient}`;
  return fetch(url);
}

export function DrinksByName(name: string): Promise<Response> {
  const url = `${URL_DRINKS}/search.php?s=${name}`;
  return fetch(url);
}

export function DrinksByFirstLetter(letter: string): Promise<Response> {
  const url = `${URL_DRINKS}/search.php?f=${letter}`;
  return fetch(url);
}
