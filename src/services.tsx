import { Revenue, Scope, SearchingType, RecommType } from './exportTypes/types';

export const ServiceFood = (food: Scope) => {
  const RECOMMENDATION_DRINK_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const RECOMMENDATION_MEAL_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
  const RECOMMENDATION_BASE_URL = food === 'meals'
    ? RECOMMENDATION_MEAL_URL
    : RECOMMENDATION_DRINK_URL;

  const TYPE_DRINK_URL = 'https://www.thecocktaildb.com/api/json/v1/1';
  const TYPE_MEAL_URL = 'https://www.themealdb.com/api/json/v1/1';
  const TYPE_BASE_URL = food === 'meals' ? TYPE_MEAL_URL : TYPE_DRINK_URL;
  return {
    search: async (type: SearchingType, term: string): Promise<Revenue[]> => {
      const response = await fetch(`${TYPE_BASE_URL}/${type === 'i' ? 'filter'
        : 'search'}.php?${type}=${term}`);
      const data = await response.json();
      return data[food] ?? [];
    },

    getById: async (id?: string): Promise<Revenue> => {
      const response = await fetch(`${TYPE_BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      if (TYPE_BASE_URL === TYPE_DRINK_URL) {
        return data.drinks[0];
      }
      return data.meals[0];
    },

    recommendation: async (): Promise<RecommType | null> => {
      const response = await fetch(RECOMMENDATION_BASE_URL);
      const data = await response.json();
      return data;
    },
  };
};
