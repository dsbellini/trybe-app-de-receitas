import { useState } from 'react';
import ProfileButton from '../ProfileButton';
import SearchButton from '../SearchButton';
import SearchBar from '../SearchBar';
import './style.css';

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
    <section className="header-section">
      <header>
        <ProfileButton />
        <h1 data-testid="page-title">{ pageTitle }</h1>
        {searchIcon && (
          <SearchButton
            barVisible={ () => {
              setSearchOnly(!searchOnly);
              onSearchButtonClick(); // Chamar a função para ocultar o Recipes
            } }
          />
        )}
      </header>
      { searchOnly && <SearchBar /> }
      <hr />
    </section>
  );
}
