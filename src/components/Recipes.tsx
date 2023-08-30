import { useState } from 'react';
import { INITIAL_CONTEXT, RevenueProvider } from '../context/RevenuesContext';
import { capitalized } from '../capitalized';
import Header from './Header';
import { Scope } from '../exportTypes/types';
import RevenueList from './Revenue/RevenuesList';
import Recipes from '../pages/PagesRecipes';
import Footer from './Footer/Footer';

export type RevenuesProps = {
  scope: Scope;
};
function Revenues({ scope }: RevenuesProps) {
  const [isRecipesVisible, setIsRecipesVisible] = useState(true);

  const handleSearchButtonClick = () => {
    setIsRecipesVisible(false); // Ocultar o componente Recipes
  };

  return (
    <RevenueProvider
      value={ {
        ...INITIAL_CONTEXT,
        ...{ state: {
          ...INITIAL_CONTEXT.state,
          scope,
        } },
      } }
    >
      <Header
        pageTitle={ `Revenues - ${capitalized(scope)}` }
        onSearchButtonClick={ handleSearchButtonClick } // Passar a função para o Header
      />
      <RevenueList />
      {isRecipesVisible && <Recipes />}
      <Footer />
    </RevenueProvider>
  );
}

export default Revenues;
