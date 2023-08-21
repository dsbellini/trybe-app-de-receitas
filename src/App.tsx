import React from 'react';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Está gerando erro no teste da pagina RecipeInProgress - favor deixar desativado ! //
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import LoginProvider from './context/LoginProvider';
import { Scope } from './exportTypes/types';
import Revenues from './components/Recipes';
import RevenuesDetails from './components/Revenue/RevenuesDetails';
import Profile from './components/Profile';
import RecipeInProgress from './components/RecipeInProgress/RecipeInProgress';

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/SearchBar" element={ <SearchBar /> } />
        <Route path="/meals" element={ <Revenues scope={ 'meals' as Scope } /> } />
        <Route path="/drinks" element={ <Revenues scope={ 'drinks' as Scope } /> } />
        <Route path="/meals/:recipeId" element={ <RevenuesDetails /> } />
        <Route path="/drinks/:recipeId" element={ <RevenuesDetails /> } />
        <Route
          path="/meals/:recipeId/in-progress"
          element={ <RecipeInProgress /> }
        />
        <Route
          path="/drinks/:recipeId/in-progress"
          element={ <RecipeInProgress /> }
        />
        <Route
          path="/done-recipes"
          element={ <Header pageTitle="Done Recipes" searchIcon={ false } /> }
        />
        <Route
          path="/favorite-recipes"
          element={ <Header pageTitle="Favorite Recipes" searchIcon={ false } /> }
        />
      </Routes>
    </LoginProvider>
  );
}

export default App;
