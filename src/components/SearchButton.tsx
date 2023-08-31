import { Button } from 'react-bootstrap';
import searchImg from '../images/searchIcon.svg';
import './SearchButtonCSS.css';

type SearchButtonProps = {
  barVisible: () => void;
};

export default function SearchButton({ barVisible }:
SearchButtonProps) {
  return (
    <Button
      variant="link"
      onClick={ () => barVisible() }
    >
      <img
        data-testid="search-top-btn"
        src={ searchImg }
        alt="search icon"
        className="search-button"
      />
    </Button>
  );
}
