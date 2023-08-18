import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import LoginContext from '../context/LoginContext';

function Login() {
  const { handleInputChange, isFormValid, onSubmit } = useContext(LoginContext);

  return (
    <>
      <h2>Faça seu login:</h2>
      <form onSubmit={ onSubmit }>
        <input
          type="email"
          placeholder="Email"
          data-testid="email-input"
          onChange={ handleInputChange }
          name="email"
        />
        <input
          type="password"
          placeholder="Senha"
          data-testid="password-input"
          onChange={ handleInputChange }
          name="password"
        />
        <Button
          type="submit"
          data-testid="login-submit-btn"
          disabled={ !isFormValid() }
        >
          Entrar
        </Button>
      </form>
    </>
  );
}

export default Login;
