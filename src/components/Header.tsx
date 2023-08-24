import { useState } from 'react';
import ProfileButton from './ProfileButton';
import SearchButton from './SearchButton';
import SearchI from './SearchBar';

type Heading = {
  pageTitle: string;
  searchIcon?: boolean;
  onSearchButtonClick: () => void; // Adicione essa prop
};

export default function Header({
  pageTitle,
  searchIcon = true,
  onSearchButtonClick, // Receber a prop aqui
}: Heading) {
  const [searchOnly, setSearchOnly] = useState(false);
  return (
    <>
      <header>
        <ProfileButton />
        {searchIcon && (
          <SearchButton
            barVisible={ () => {
              setSearchOnly(!searchOnly);
              onSearchButtonClick(); // Chamar a função para ocultar o Recipes
            } }
          />
        )}
        { searchOnly && <SearchI /> }
        <h1 data-testid="page-title">{ pageTitle }</h1>
      </header>
      <hr />
    </>
  );
}
