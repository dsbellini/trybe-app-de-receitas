import { createContext } from 'react';

type LoginContextType = {
  formData: { email: string; password: string };
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFormValid: () => boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const LoginContext = createContext({} as LoginContextType);

export default LoginContext;
