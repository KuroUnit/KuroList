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

// Componente de redirecionamento
const RedirectRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainApp />} />
          <Route path="/*" element={<RedirectRoute />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;