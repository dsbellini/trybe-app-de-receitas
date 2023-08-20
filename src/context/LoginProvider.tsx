import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from './LoginContext';

const INITIAL_STATE = {
  email: '',
  password: '',
};

type LoginProviderProps = {
  children: React.ReactNode;
};

function LoginProvider({ children }: LoginProviderProps) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const navigate = useNavigate();

  // Função para capturar o valor do input e atualizar o estado
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Função para validar o formulário
  const isFormValid = () => {
    const { email, password } = formData;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    return (
      password.trim() !== ''
            && email.trim() !== ''
            && password.trim() !== ''
            && password.length >= 7
            && emailRegex.test(email)
    );
  };

  // Função para submeter o formulário
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email: formData.email }));
    navigate('/meals');
  };

  // Passando os valores para o context
  return (
    <LoginContext.Provider
      value={ { handleInputChange,
        isFormValid,
        formData,
        onSubmit,
      } }
    >
      { children }
    </LoginContext.Provider>
  );
}

export default LoginProvider;
