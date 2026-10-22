// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/Routes';
import ToastWrapper from './components/common/ToastWrapper';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
      <ToastWrapper />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
