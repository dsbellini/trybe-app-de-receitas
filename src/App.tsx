import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import LoginProvider from './context/LoginProvider';
import Profile from './components/Profile';

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/profile" element={ <Profile /> } />
      </Routes>
    </LoginProvider>
  );
}

export default App;
