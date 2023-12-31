import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { Revenue, SearchParams } from '../exportTypes/types';
import { ServiceFood } from '../services';
import { RevenueContext } from '../context/RevenuesContext';
import './SearchBarCSS.css';

export default function SearchBar() {
  const INITIAL_SEARCH: SearchParams = {
    type: 's',
    term: '',
  };

  const { state, update } = useContext(RevenueContext);
  const [searchParams, setSearchParams] = useState<SearchParams>(INITIAL_SEARCH);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams, [e.target.id]: e.target.value,
    });
  };

  const handleClick = async () => {
    if (searchParams.type === 'f' && searchParams.term.length > 1) {
      window.alert('Your search must have only 1 (one) character');
      return;
    }
    let result = await ServiceFood(state.scope)
      .search(searchParams.type, searchParams.term) as Revenue[];

    if (result.length > 12) {
      result = result.slice(0, 12);
    }
    update({
      ...state, searchParams, recipes: result,
    });

    if (result.length === 0) {
      window.alert('Sorry, we haven\'t found any recipes for these filters.');
      return;
    }

    if (result.length === 1) {
      const { idMeal, idDrink } = result[0];
      navigate(`/${state.scope}/${idMeal || idDrink}`);
    }
  };

  return (
    <>
      <FormGroup
        className="search-radio-buttons"
      >
        <label>
          <input
            checked={ searchParams.type === 'i' }
            type="radio"
            id="type"
            name="search"
            value="i"
            data-testid="ingredient-search-radio"
            onChange={ handleChange }
          />
          Ingredient
        </label>
        <label>
          <input
            checked={ searchParams.type === 's' }
            type="radio"
            id="type"
            name="search"
            value="s"
            data-testid="name-search-radio"
            onChange={ handleChange }
          />
          Name
        </label>
        <label>
          <input
            checked={ searchParams.type === 'f' }
            type="radio"
            id="type"
            name="search"
            value="f"
            data-testid="first-letter-search-radio"
            onChange={ handleChange }
          />
          First letter
        </label>

      </FormGroup>
      <Form.Control
        id="term"
        value={ searchParams.term }
        data-testid="search-input"
        type="text"
        placeholder="Buscar Receita"
        onChange={ handleChange }
      />
      <div className="d-grid gap-2">
        <Button
          type="button"
          variant="success"
          data-testid="exec-search-btn"
          onClick={ handleClick }
          className="search-btn"
        >
          Search
        </Button>
      </div>
    </>
  );
}
