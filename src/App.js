import './App.css'; 
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authService from "./appwrite/authService";
import { login, logout } from "./store/AuthSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
    <div className="app-container">
      <div className="content-wrapper">
        <Header/>
        <main className="main-content">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  ) : null;
}

export default App;
