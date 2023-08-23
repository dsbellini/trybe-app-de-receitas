import { useState } from 'react';
import ProfileButton from './ProfileButton';
import SearchButton from './SearchButton';
import SearchI from './SearchBar';

type Heading = {
  pageTitle: string;
  searchIcon?: boolean;
};

export default function Header({ pageTitle, searchIcon = true }:
Heading) {
  const [searchOnly, setSearchOnly] = useState(false);
  return (
    <>
      <header>
        <ProfileButton />
        { searchIcon && <SearchButton
          barVisible={ () => setSearchOnly(!searchOnly) }
        /> }
        { searchOnly && <SearchI /> }
        <h1 data-testid="page-title">{ pageTitle }</h1>
      </header>
      <hr />
    </>
  );
}
