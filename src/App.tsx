import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Recipes from './pages/Recipes';
import LoginProvider from './context/LoginProvider';
import Footer from './components/Footer'; 

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/*" element={<Footer />} />
        <Route path="/meals" element={ <Recipes /> } />
        <Route path="/drinks" element={ <Recipes /> } />
      </Routes>
    </LoginProvider>
  );
}

export default App;
