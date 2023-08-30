import { Button, Form } from 'react-bootstrap';
import { useContext } from 'react';
import Image from 'react-bootstrap/Image';
import LoginContext from '../../context/LoginContext';
import Cookfy from '../../images/Cookfy.svg';
import './style.css';

function Login() {
  const { handleInputChange, isFormValid, onSubmit } = useContext(LoginContext);

  return (
    <main className="login-page">
      <div className="cookfy-logo">
        <Image src={ Cookfy } alt="Cookfy logo" />
      </div>
      <section className="form-login">
        <Form onSubmit={ onSubmit }>
          <Form.Group className="mb-3">

            <Form.Control
              type="email"
              placeholder="Email"
              data-testid="email-input"
              onChange={ handleInputChange }
              name="email"
              size="sm"
            />
            <Form.Control
              type="password"
              placeholder="Senha"
              data-testid="password-input"
              onChange={ handleInputChange }
              name="password"
              size="sm"

            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="success"
              type="submit"
              data-testid="login-submit-btn"
              disabled={ !isFormValid() }
              className="login-button"
            >
              Login
            </Button>
          </div>
        </Form>
      </section>
    </main>
  );
}

export default Login;
