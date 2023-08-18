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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email: formData.email }));
    navigate('/meals');
  };

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
