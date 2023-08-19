import searchImg from '../images/searchIcon.svg';

type SearchButtonProps = {
  barVisible: () => void;
};

export default function SearchButton({ barVisible }:
SearchButtonProps) {
  return (
    <button onClick={ () => barVisible() }>
      <img
        data-testid="search-top-btn"
        src={ searchImg }
        alt="search icon"
      />
    </button>
  );
}
