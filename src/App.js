import React from 'react';
import './App.css';

import Drawer from './components/Drawer';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  return (
    
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Drawer />
  </ThemeProvider>
  );
}

export default App;
