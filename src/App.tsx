import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Está gerando erro no teste da pagina RecipeInProgress - favor deixar desativado ! //
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Recipes from './pages/PagesRecipes';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import LoginProvider from './context/LoginProvider';
import { Scope } from './exportTypes/types';
import Revenues from './components/Recipes';
import RecipeDetails from './components/RecipeDetails';
import Profile from './components/Profile';
import RecipeInProgress from './components/RecipeInProgress/RecipeInProgress';

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={ <Login /> } />
        {/* <Route path="/meals" element={ <Recipes /> } />
        <Route path="/drinks" element={ <Recipes /> } /> */}
        <Route path="/*" element={ <Footer /> } />
        <Route path="/meals" element={ <Revenues scope={ 'meals' as Scope } /> } />
        <Route path="/drinks" element={ <Revenues scope={ 'drinks' as Scope } /> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/SearchBar" element={ <SearchBar /> } />
        <Route
          path="/meals/:recipeId"
          element={ <RecipeDetails
            scope={ 'meals' as Scope }
          /> }
        />
        <Route
          path="/drinks/:recipeId"
          element={ <RecipeDetails
            scope={ 'drinks' as Scope }
          /> }
        />
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
