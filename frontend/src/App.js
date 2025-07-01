import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import MainApp from './MainApp';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Componente de protegeção das rotas
const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <MainApp /> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<PrivateRoute />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;