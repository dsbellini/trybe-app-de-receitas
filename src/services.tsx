import { Revenue, Scope, SearchingType } from './exportTypes/types';

export const ServiceFood = (food: Scope) => {
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
    getById: async (id: string): Promise<Revenue> => {
      const response = await fetch(`${TYPE_BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data;
    },
  };
};
